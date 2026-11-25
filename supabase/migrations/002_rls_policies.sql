-- Phase 2: Row Level Security Policies
-- Travel Discovery & Planning Platform
-- Role-based access control with helper functions

-- ============================================
-- HELPER FUNCTIONS FOR RLS
-- ============================================

-- Check if current user is super_admin
CREATE OR REPLACE FUNCTION is_super_admin()
RETURNS BOOLEAN AS $$
DECLARE
  v_role user_role;
BEGIN
  SELECT role INTO v_role FROM profiles WHERE id = auth.uid();
  RETURN v_role = 'super_admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if current user is content_editor or higher
CREATE OR REPLACE FUNCTION is_content_editor_or_higher()
RETURNS BOOLEAN AS $$
DECLARE
  v_role user_role;
BEGIN
  SELECT role INTO v_role FROM profiles WHERE id = auth.uid();
  RETURN v_role IN ('super_admin', 'content_editor');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if current user is moderator or higher
CREATE OR REPLACE FUNCTION is_moderator_or_higher()
RETURNS BOOLEAN AS $$
DECLARE
  v_role user_role;
BEGIN
  SELECT role INTO v_role FROM profiles WHERE id = auth.uid();
  RETURN v_role IN ('super_admin', 'content_editor', 'moderator');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if current user is the owner of a resource
CREATE OR REPLACE FUNCTION is_owner(resource_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN auth.uid() = resource_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if user is a member of a trip
CREATE OR REPLACE FUNCTION is_trip_member(trip_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_count
  FROM trip_members
  WHERE trip_id = is_trip_member.trip_id AND user_id = auth.uid();
  RETURN v_count > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- ENABLE RLS ON ALL TABLES
-- ============================================

ALTER TABLE countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE destination_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE attractions ENABLE ROW LEVEL SECURITY;
ALTER TABLE destination_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE guide_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE itineraries ENABLE ROW LEVEL SECURITY;
ALTER TABLE itinerary_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE itinerary_stops ENABLE ROW LEVEL SECURITY;
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_itineraries ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- ============================================
-- COUNTRIES - Public read, admin write
-- ============================================

CREATE POLICY "Countries are viewable by everyone"
ON countries FOR SELECT
USING (true);

CREATE POLICY "Countries manageable by super_admin"
ON countries FOR ALL
USING (is_super_admin())
WITH CHECK (is_super_admin());

-- ============================================
-- PROFILES - Users see own, public can see basic info, admins manage all
-- ============================================

CREATE POLICY "Profiles viewable by everyone (basic info)"
ON profiles FOR SELECT
USING (true);

CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (is_owner(id))
WITH CHECK (is_owner(id));

CREATE POLICY "Users can insert own profile"
ON profiles FOR INSERT
WITH CHECK (is_owner(id));

CREATE POLICY "Admins can manage all profiles"
ON profiles FOR ALL
USING (is_super_admin())
WITH CHECK (is_super_admin());

-- ============================================
-- CATEGORIES - Public read, admin write
-- ============================================

CREATE POLICY "Categories viewable by everyone"
ON categories FOR SELECT
USING (true);

CREATE POLICY "Categories manageable by content_editor_or_higher"
ON categories FOR ALL
USING (is_content_editor_or_higher())
WITH CHECK (is_content_editor_or_higher());

-- ============================================
-- GUIDE_CATEGORIES - Public read, admin write
-- ============================================

CREATE POLICY "Guide categories viewable by everyone"
ON guide_categories FOR SELECT
USING (true);

CREATE POLICY "Guide categories manageable by content_editor_or_higher"
ON guide_categories FOR ALL
USING (is_content_editor_or_higher())
WITH CHECK (is_content_editor_or_higher());

-- ============================================
-- DESTINATIONS - Published public, drafts to editors+, owner edit
-- ============================================

CREATE POLICY "Published destinations viewable by everyone"
ON destinations FOR SELECT
USING (publication_status = 'published');

CREATE POLICY "Draft/archived destinations viewable by content_editor_or_higher"
ON destinations FOR SELECT
USING (publication_status != 'published' AND is_content_editor_or_higher());

CREATE POLICY "Destinations manageable by content_editor_or_higher"
ON destinations FOR ALL
USING (is_content_editor_or_higher())
WITH CHECK (is_content_editor_or_higher());

-- ============================================
-- DESTINATION_IMAGES - Follow destination visibility
-- ============================================

CREATE POLICY "Destination images viewable with destination"
ON destination_images FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM destinations d
    WHERE d.id = destination_images.destination_id
    AND (d.publication_status = 'published' OR is_content_editor_or_higher())
  )
);

CREATE POLICY "Destination images manageable by content_editor_or_higher"
ON destination_images FOR ALL
USING (is_content_editor_or_higher())
WITH CHECK (is_content_editor_or_higher());

-- ============================================
-- ATTRACTIONS - Follow destination visibility
-- ============================================

CREATE POLICY "Attractions viewable with destination"
ON attractions FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM destinations d
    WHERE d.id = attractions.destination_id
    AND (d.publication_status = 'published' OR is_content_editor_or_higher())
  )
);

CREATE POLICY "Attractions manageable by content_editor_or_higher"
ON attractions FOR ALL
USING (is_content_editor_or_higher())
WITH CHECK (is_content_editor_or_higher());

-- ============================================
-- DESTINATION_CATEGORIES - Follow destination visibility
-- ============================================

CREATE POLICY "Destination categories viewable with destination"
ON destination_categories FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM destinations d
    WHERE d.id = destination_categories.destination_id
    AND (d.publication_status = 'published' OR is_content_editor_or_higher())
  )
);

CREATE POLICY "Destination categories manageable by content_editor_or_higher"
ON destination_categories FOR ALL
USING (is_content_editor_or_higher())
WITH CHECK (is_content_editor_or_higher());

-- ============================================
-- GUIDES - Published public, drafts to author/editors+
-- ============================================

CREATE POLICY "Published guides viewable by everyone"
ON guides FOR SELECT
USING (publication_status = 'published');

CREATE POLICY "Draft guides viewable by author and editors+"
ON guides FOR SELECT
USING (publication_status != 'published' AND (is_owner(author_id) OR is_content_editor_or_higher()));

CREATE POLICY "Guides manageable by author and editors+"
ON guides FOR ALL
USING (is_owner(author_id) OR is_content_editor_or_higher())
WITH CHECK (is_owner(author_id) OR is_content_editor_or_higher());

-- ============================================
-- ITINERARIES - Published public, drafts to author/editors+
-- ============================================

CREATE POLICY "Published itineraries viewable by everyone"
ON itineraries FOR SELECT
USING (publication_status = 'published');

CREATE POLICY "Draft itineraries viewable by author and editors+"
ON itineraries FOR SELECT
USING (publication_status != 'published' AND (is_owner(author_id) OR is_content_editor_or_higher()));

CREATE POLICY "Itineraries manageable by author and editors+"
ON itineraries FOR ALL
USING (is_owner(author_id) OR is_content_editor_or_higher())
WITH CHECK (is_owner(author_id) OR is_content_editor_or_higher());

-- ============================================
-- ITINERARY_DAYS - Follow itinerary visibility
-- ============================================

CREATE POLICY "Itinerary days viewable with itinerary"
ON itinerary_days FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM itineraries i
    WHERE i.id = itinerary_days.itinerary_id
    AND (i.publication_status = 'published' OR is_owner(i.author_id) OR is_content_editor_or_higher())
  )
);

CREATE POLICY "Itinerary days manageable by author and editors+"
ON itinerary_days FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM itineraries i
    WHERE i.id = itinerary_days.itinerary_id
    AND (is_owner(i.author_id) OR is_content_editor_or_higher())
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM itineraries i
    WHERE i.id = itinerary_days.itinerary_id
    AND (is_owner(i.author_id) OR is_content_editor_or_higher())
  )
);

-- ============================================
-- ITINERARY_STOPS - Follow itinerary visibility
-- ============================================

CREATE POLICY "Itinerary stops viewable with itinerary"
ON itinerary_stops FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM itinerary_days id
    JOIN itineraries i ON i.id = id.itinerary_id
    WHERE id.id = itinerary_stops.itinerary_day_id
    AND (i.publication_status = 'published' OR is_owner(i.author_id) OR is_content_editor_or_higher())
  )
);

CREATE POLICY "Itinerary stops manageable by author and editors+"
ON itinerary_stops FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM itinerary_days id
    JOIN itineraries i ON i.id = id.itinerary_id
    WHERE id.id = itinerary_stops.itinerary_day_id
    AND (is_owner(i.author_id) OR is_content_editor_or_higher())
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM itinerary_days id
    JOIN itineraries i ON i.id = id.itinerary_id
    WHERE id.id = itinerary_stops.itinerary_day_id
    AND (is_owner(i.author_id) OR is_content_editor_or_higher())
  )
);

-- ============================================
-- TRIPS - Owner and members can view, owner manages
-- ============================================

CREATE POLICY "Trips viewable by owner and members"
ON trips FOR SELECT
USING (is_owner(user_id) OR is_trip_member(id) OR is_public OR is_content_editor_or_higher());

CREATE POLICY "Trips manageable by owner"
ON trips FOR ALL
USING (is_owner(user_id) OR is_content_editor_or_higher())
WITH CHECK (is_owner(user_id) OR is_content_editor_or_higher());

-- ============================================
-- TRIP_MEMBERS - Members can view, owner manages
-- ============================================

CREATE POLICY "Trip members viewable by trip members"
ON trip_members FOR SELECT
USING (
  is_trip_member(trip_id) OR
  is_owner((SELECT user_id FROM trips WHERE id = trip_members.trip_id)) OR
  is_content_editor_or_higher()
);

CREATE POLICY "Trip members manageable by trip owner"
ON trip_members FOR ALL
USING (
  is_owner((SELECT user_id FROM trips WHERE id = trip_members.trip_id)) OR
  is_content_editor_or_higher()
)
WITH CHECK (
  is_owner((SELECT user_id FROM trips WHERE id = trip_members.trip_id)) OR
  is_content_editor_or_higher()
);

-- ============================================
-- SAVED_DESTINATIONS - Users manage own
-- ============================================

CREATE POLICY "Users can view own saved destinations"
ON saved_destinations FOR SELECT
USING (is_owner(user_id));

CREATE POLICY "Users can manage own saved destinations"
ON saved_destinations FOR ALL
USING (is_owner(user_id))
WITH CHECK (is_owner(user_id));

-- ============================================
-- SAVED_ITINERARIES - Users manage own
-- ============================================

CREATE POLICY "Users can view own saved itineraries"
ON saved_itineraries FOR SELECT
USING (is_owner(user_id));

CREATE POLICY "Users can manage own saved itineraries"
ON saved_itineraries FOR ALL
USING (is_owner(user_id))
WITH CHECK (is_owner(user_id));

-- ============================================
-- REVIEWS - Published viewable by all, users manage own, moderators manage all
-- ============================================

CREATE POLICY "Published reviews viewable by everyone"
ON reviews FOR SELECT
USING (status = 'published');

CREATE POLICY "Users can view own reviews"
ON reviews FOR SELECT
USING (is_owner(user_id));

CREATE POLICY "Moderators can view all reviews"
ON reviews FOR SELECT
USING (is_moderator_or_higher());

CREATE POLICY "Users can insert own reviews"
ON reviews FOR INSERT
WITH CHECK (is_owner(user_id));

CREATE POLICY "Users can update own reviews"
ON reviews FOR UPDATE
USING (is_owner(user_id))
WITH CHECK (is_owner(user_id));

CREATE POLICY "Moderators can manage all reviews"
ON reviews FOR ALL
USING (is_moderator_or_higher())
WITH CHECK (is_moderator_or_higher());

-- ============================================
-- COMMENTS - Published viewable by all, users manage own, moderators manage all
-- ============================================

CREATE POLICY "Published comments viewable by everyone"
ON comments FOR SELECT
USING (status = 'published');

CREATE POLICY "Users can view own comments"
ON comments FOR SELECT
USING (is_owner(user_id));

CREATE POLICY "Moderators can view all comments"
ON comments FOR SELECT
USING (is_moderator_or_higher());

CREATE POLICY "Users can insert own comments"
ON comments FOR INSERT
WITH CHECK (is_owner(user_id));

CREATE POLICY "Users can update own comments"
ON comments FOR UPDATE
USING (is_owner(user_id))
WITH CHECK (is_owner(user_id));

CREATE POLICY "Moderators can manage all comments"
ON comments FOR ALL
USING (is_moderator_or_higher())
WITH CHECK (is_moderator_or_higher());

-- ============================================
-- COMMUNITY_POSTS - Published/draft by author, moderators manage all
-- ============================================

CREATE POLICY "Published community posts viewable by everyone"
ON community_posts FOR SELECT
USING (status = 'published');

CREATE POLICY "Users can view own community posts"
ON community_posts FOR SELECT
USING (is_owner(user_id));

CREATE POLICY "Moderators can view all community posts"
ON community_posts FOR SELECT
USING (is_moderator_or_higher());

CREATE POLICY "Users can manage own community posts"
ON community_posts FOR ALL
USING (is_owner(user_id))
WITH CHECK (is_owner(user_id));

CREATE POLICY "Moderators can manage all community posts"
ON community_posts FOR ALL
USING (is_moderator_or_higher())
WITH CHECK (is_moderator_or_higher());

-- ============================================
-- MEDIA - Users manage own, moderators view all
-- ============================================

CREATE POLICY "Users can view own media"
ON media FOR SELECT
USING (is_owner(user_id));

CREATE POLICY "Moderators can view all media"
ON media FOR SELECT
USING (is_moderator_or_higher());

CREATE POLICY "Users can manage own media"
ON media FOR ALL
USING (is_owner(user_id))
WITH CHECK (is_owner(user_id));

CREATE POLICY "Moderators can manage all media"
ON media FOR ALL
USING (is_moderator_or_higher())
WITH CHECK (is_moderator_or_higher());

-- ============================================
-- NEWSLETTER_SUBSCRIBERS - Email owner and admins
-- ============================================

CREATE POLICY "Users can view own subscription"
ON newsletter_subscribers FOR SELECT
USING (
  email = (SELECT email FROM auth.users WHERE id = auth.uid()) OR
  is_super_admin()
);

CREATE POLICY "Users can manage own subscription"
ON newsletter_subscribers FOR ALL
USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()))
WITH CHECK (email = (SELECT email FROM auth.users WHERE id = auth.uid()));

CREATE POLICY "Admins can manage all subscriptions"
ON newsletter_subscribers FOR ALL
USING (is_super_admin())
WITH CHECK (is_super_admin());

-- ============================================
-- CONTENT_SOURCES - Editors+ view, editors+ manage
-- ============================================

CREATE POLICY "Content sources viewable by content_editor_or_higher"
ON content_sources FOR SELECT
USING (is_content_editor_or_higher());

CREATE POLICY "Content sources manageable by content_editor_or_higher"
ON content_sources FOR ALL
USING (is_content_editor_or_higher())
WITH CHECK (is_content_editor_or_higher());

-- ============================================
-- REPORTS - Reporters and moderators
-- ============================================

CREATE POLICY "Reporters can view own reports"
ON reports FOR SELECT
USING (is_owner(reporter_id));

CREATE POLICY "Moderators can view all reports"
ON reports FOR SELECT
USING (is_moderator_or_higher());

CREATE POLICY "Users can create reports"
ON reports FOR INSERT
WITH CHECK (is_owner(reporter_id));

CREATE POLICY "Moderators can manage reports"
ON reports FOR ALL
USING (is_moderator_or_higher())
WITH CHECK (is_moderator_or_higher());