-- Phase 2: Seed Data
-- Travel Discovery & Planning Platform
-- Countries, categories, and 4 sample destinations (3 India + 1 international)

-- ============================================
-- COUNTRIES
-- ============================================

INSERT INTO countries (name, slug, iso_code, currency_code) VALUES
  ('India', 'india', 'IN', 'INR'),
  ('Japan', 'japan', 'JP', 'JPY'),
  ('Italy', 'italy', 'IT', 'EUR'),
  ('Thailand', 'thailand', 'TH', 'THB'),
  ('Australia', 'australia', 'AU', 'AUD'),
  ('New Zealand', 'new-zealand', 'NZ', 'NZD'),
  ('Iceland', 'iceland', 'IS', 'ISK'),
  ('Peru', 'peru', 'PE', 'PEN'),
  ('Morocco', 'morocco', 'MA', 'MAD'),
  ('South Africa', 'south-africa', 'ZA', 'ZAR')
ON CONFLICT (iso_code) DO NOTHING;

-- ============================================
-- CATEGORIES (Experience Categories)
-- ============================================

INSERT INTO categories (name, slug, description, icon) VALUES
  ('Mountains and Trekking', 'mountains-trekking', 'High-altitude adventures, trekking trails, and mountain landscapes', 'mountain'),
  ('Road Trips', 'road-trips', 'Scenic drives, highway adventures, and road trip itineraries', 'car'),
  ('Beaches and Islands', 'beaches-islands', 'Coastal paradises, island hopping, and beach destinations', 'waves'),
  ('Nature and Wildlife', 'nature-wildlife', 'National parks, wildlife safaris, and natural wonders', 'leaf'),
  ('Culture and Heritage', 'culture-heritage', 'Historical sites, cultural experiences, and heritage trails', 'landmark'),
  ('Adventure', 'adventure', 'Adrenaline-pumping activities and extreme sports', 'zap'),
  ('Photography', 'photography', 'Photogenic locations, golden hour spots, and photo tours', 'camera'),
  ('Food and Local Experiences', 'food-local', 'Culinary journeys, street food, and authentic local experiences', 'utensils')
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- GUIDE CATEGORIES
-- ============================================

INSERT INTO guide_categories (name, slug, description) VALUES
  ('Destination Guides', 'destination-guides', 'Comprehensive guides to specific destinations'),
  ('Travel Tips', 'travel-tips', 'Practical advice for planning and executing trips'),
  ('Budget Travel', 'budget-travel', 'Guides for traveling on a budget'),
  ('Solo Travel', 'solo-travel', 'Resources and tips for solo travelers'),
  ('Family Travel', 'family-travel', 'Guides for traveling with families and children'),
  ('Photography Guides', 'photography-guides', 'Photography-focused travel guides'),
  ('Food Guides', 'food-guides', 'Culinary guides and restaurant recommendations'),
  ('Adventure Guides', 'adventure-guides', 'Adventure sports and activity guides')
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- DESTINATIONS
-- ============================================

-- Get India country ID
DO $$
DECLARE
  v_india_id UUID;
  v_japan_id UUID;
BEGIN
  SELECT id INTO v_india_id FROM countries WHERE iso_code = 'IN';
  SELECT id INTO v_japan_id FROM countries WHERE iso_code = 'JP';

  -- Ladakh, India
  INSERT INTO destinations (
    country_id, name, slug, state_region, city,
    latitude, longitude,
    short_description, detailed_description,
    hero_image, gallery_images,
    best_seasons, avg_duration_days, budget_guidance, travel_difficulty,
    publication_status, seo_title, seo_description, last_verified
  ) VALUES (
    v_india_id, 'Ladakh', 'ladakh', 'Ladakh', 'Leh',
    34.1526, 77.5770,
    'Land of high passes with stark landscapes, ancient monasteries, and crystal-clear lakes.',
    'Ladakh, often called "Little Tibet," is a high-altitude desert region in the northernmost part of India. Known for its dramatic landscapes ranging from barren mountains to turquoise lakes, ancient Buddhist monasteries perched on cliffs, and a unique culture that has remained largely unchanged for centuries. The region offers some of the world''s highest motorable roads, challenging treks, and unparalleled stargazing opportunities.',
    '/images/destinations/ladakh-hero.jpg',
    ARRAY['/images/destinations/ladakh-1.jpg', '/images/destinations/ladakh-2.jpg', '/images/destinations/ladakh-3.jpg'],
    ARRAY['May', 'June', 'July', 'August', 'September'],
    7, '₹50,000 - ₹80,000 per person (excluding flights)', 'Moderate to Challenging',
    'published', 'Ladakh Travel Guide 2026 - Complete Guide to the Land of High Passes', 'Discover Ladakh with our comprehensive guide. From Pangong Tso to Nubra Valley, find best routes, monasteries, treks, and travel tips for your Ladakh adventure.', '2026-01-15'
  ) ON CONFLICT (country_id, slug) DO UPDATE SET
    name = EXCLUDED.name,
    state_region = EXCLUDED.state_region,
    city = EXCLUDED.city,
    latitude = EXCLUDED.latitude,
    longitude = EXCLUDED.longitude,
    short_description = EXCLUDED.short_description,
    detailed_description = EXCLUDED.detailed_description,
    hero_image = EXCLUDED.hero_image,
    gallery_images = EXCLUDED.gallery_images,
    best_seasons = EXCLUDED.best_seasons,
    avg_duration_days = EXCLUDED.avg_duration_days,
    budget_guidance = EXCLUDED.budget_guidance,
    travel_difficulty = EXCLUDED.travel_difficulty,
    publication_status = EXCLUDED.publication_status,
    seo_title = EXCLUDED.seo_title,
    seo_description = EXCLUDED.seo_description,
    last_verified = EXCLUDED.last_verified,
    updated_at = NOW();

  -- Spiti Valley, India
  INSERT INTO destinations (
    country_id, name, slug, state_region, city,
    latitude, longitude,
    short_description, detailed_description,
    hero_image, gallery_images,
    best_seasons, avg_duration_days, budget_guidance, travel_difficulty,
    publication_status, seo_title, seo_description, last_verified
  ) VALUES (
    v_india_id, 'Spiti Valley', 'spiti-valley', 'Himachal Pradesh', 'Kaza',
    32.2978, 78.0081,
    'Cold desert valley with ancient monasteries, fossil-rich terrain, and remote villages frozen in time.',
    'Spiti Valley, meaning "The Middle Land," lies between Tibet and India in the trans-Himalayan region of Himachal Pradesh. This cold desert mountain valley is characterized by its stark beauty, ancient monasteries like Key and Tabo, fossil-rich terrain dating back millions of years, and remote villages that preserve a way of life untouched by modernity. The journey to Spiti itself is an adventure, crossing high mountain passes like Kunzum La and Rohtang Pass.',
    '/images/destinations/spiti-hero.jpg',
    ARRAY['/images/destinations/spiti-1.jpg', '/images/destinations/spiti-2.jpg', '/images/destinations/spiti-3.jpg'],
    ARRAY['May', 'June', 'July', 'August', 'September', 'October'],
    6, '₹40,000 - ₹65,000 per person (excluding flights)', 'Challenging',
    'published', 'Spiti Valley Travel Guide 2026 - Complete Guide to the Cold Desert', 'Explore Spiti Valley with our detailed guide. Discover Key Monastery, Chandratal Lake, Pin Valley, and remote villages. Find road routes, best time to visit, and essential travel tips.', '2026-01-15'
  ) ON CONFLICT (country_id, slug) DO UPDATE SET
    name = EXCLUDED.name,
    state_region = EXCLUDED.state_region,
    city = EXCLUDED.city,
    latitude = EXCLUDED.latitude,
    longitude = EXCLUDED.longitude,
    short_description = EXCLUDED.short_description,
    detailed_description = EXCLUDED.detailed_description,
    hero_image = EXCLUDED.hero_image,
    gallery_images = EXCLUDED.gallery_images,
    best_seasons = EXCLUDED.best_seasons,
    avg_duration_days = EXCLUDED.avg_duration_days,
    budget_guidance = EXCLUDED.budget_guidance,
    travel_difficulty = EXCLUDED.travel_difficulty,
    publication_status = EXCLUDED.publication_status,
    seo_title = EXCLUDED.seo_title,
    seo_description = EXCLUDED.seo_description,
    last_verified = EXCLUDED.last_verified,
    updated_at = NOW();

  -- Uttarakhand, India
  INSERT INTO destinations (
    country_id, name, slug, state_region, city,
    latitude, longitude,
    short_description, detailed_description,
    hero_image, gallery_images,
    best_seasons, avg_duration_days, budget_guidance, travel_difficulty,
    publication_status, seo_title, seo_description, last_verified
  ) VALUES (
    v_india_id, 'Uttarakhand', 'uttarakhand', 'Uttarakhand', 'Dehradun',
    30.0668, 79.0193,
    'Devbhoomi - Land of Gods with Himalayan peaks, sacred rivers, and diverse adventures.',
    'Uttarakhand, known as "Devbhoomi" or Land of Gods, is a state in northern India crossed by the Himalayas. It encompasses everything from the sacred Char Dham pilgrimage sites (Yamunotri, Gangotri, Kedarnath, Badrinath) to the hill stations of Nainital and Mussoorie, the wildlife haven of Jim Corbett National Park, and the adventure capital Rishikesh. The state offers spiritual journeys, white-water rafting, trekking in the Valley of Flowers, and serene lakeside retreats.',
    '/images/destinations/uttarakhand-hero.jpg',
    ARRAY['/images/destinations/uttarakhand-1.jpg', '/images/destinations/uttarakhand-2.jpg', '/images/destinations/uttarakhand-3.jpg'],
    ARRAY['March', 'April', 'May', 'June', 'September', 'October', 'November'],
    5, '₹25,000 - ₹50,000 per person (excluding flights)', 'Easy to Moderate',
    'published', 'Uttarakhand Travel Guide 2026 - Devbhoomi Complete Travel Guide', 'Discover Uttarakhand - the Land of Gods. From Char Dham yatra to Valley of Flowers trek, Rishikesh adventures to Nainital lakes. Complete guide with itineraries, best time, and travel tips.', '2026-01-15'
  ) ON CONFLICT (country_id, slug) DO UPDATE SET
    name = EXCLUDED.name,
    state_region = EXCLUDED.state_region,
    city = EXCLUDED.city,
    latitude = EXCLUDED.latitude,
    longitude = EXCLUDED.longitude,
    short_description = EXCLUDED.short_description,
    detailed_description = EXCLUDED.detailed_description,
    hero_image = EXCLUDED.hero_image,
    gallery_images = EXCLUDED.gallery_images,
    best_seasons = EXCLUDED.best_seasons,
    avg_duration_days = EXCLUDED.avg_duration_days,
    budget_guidance = EXCLUDED.budget_guidance,
    travel_difficulty = EXCLUDED.travel_difficulty,
    publication_status = EXCLUDED.publication_status,
    seo_title = EXCLUDED.seo_title,
    seo_description = EXCLUDED.seo_description,
    last_verified = EXCLUDED.last_verified,
    updated_at = NOW();

  -- Kyoto, Japan (International destination)
  INSERT INTO destinations (
    country_id, name, slug, state_region, city,
    latitude, longitude,
    short_description, detailed_description,
    hero_image, gallery_images,
    best_seasons, avg_duration_days, budget_guidance, travel_difficulty,
    publication_status, seo_title, seo_description, last_verified
  ) VALUES (
    v_japan_id, 'Kyoto', 'kyoto', 'Kansai Region', 'Kyoto',
    35.0116, 135.7681,
    'Ancient capital of Japan with 1,600+ temples, traditional gardens, and geisha districts.',
    'Kyoto served as Japan''s imperial capital for over a thousand years and remains the cultural heart of the country. With over 1,600 Buddhist temples, 400 Shinto shrines, 17 UNESCO World Heritage sites, and preserved geisha districts like Gion, Kyoto offers an unparalleled glimpse into traditional Japan. The city is famous for its seasonal beauty - cherry blossoms in spring, vibrant maple leaves in autumn, snow-covered temples in winter, and lush moss gardens in summer.',
    '/images/destinations/kyoto-hero.jpg',
    ARRAY['/images/destinations/kyoto-1.jpg', '/images/destinations/kyoto-2.jpg', '/images/destinations/kyoto-3.jpg'],
    ARRAY['March', 'April', 'October', 'November'],
    4, '¥150,000 - ¥250,000 per person (excluding flights)', 'Easy',
    'published', 'Kyoto Travel Guide 2026 - Ancient Capital of Japan Complete Guide', 'Explore Kyoto with our comprehensive guide. Discover Kinkaku-ji, Fushimi Inari, Arashiyama Bamboo Grove, Gion district, and hidden temples. Best time to visit, transport, and cultural etiquette.', '2026-01-15'
  ) ON CONFLICT (country_id, slug) DO UPDATE SET
    name = EXCLUDED.name,
    state_region = EXCLUDED.state_region,
    city = EXCLUDED.city,
    latitude = EXCLUDED.latitude,
    longitude = EXCLUDED.longitude,
    short_description = EXCLUDED.short_description,
    detailed_description = EXCLUDED.detailed_description,
    hero_image = EXCLUDED.hero_image,
    gallery_images = EXCLUDED.gallery_images,
    best_seasons = EXCLUDED.best_seasons,
    avg_duration_days = EXCLUDED.avg_duration_days,
    budget_guidance = EXCLUDED.budget_guidance,
    travel_difficulty = EXCLUDED.travel_difficulty,
    publication_status = EXCLUDED.publication_status,
    seo_title = EXCLUDED.seo_title,
    seo_description = EXCLUDED.seo_description,
    last_verified = EXCLUDED.last_verified,
    updated_at = NOW();
END $$;

-- ============================================
-- DESTINATION CATEGORIES (Many-to-Many)
-- ============================================

DO $$
DECLARE
  v_ladakh_id UUID;
  v_spiti_id UUID;
  v_uttarakhand_id UUID;
  v_kyoto_id UUID;
  v_cat_mountains UUID;
  v_cat_road UUID;
  v_cat_beaches UUID;
  v_cat_nature UUID;
  v_cat_culture UUID;
  v_cat_adventure UUID;
  v_cat_photo UUID;
  v_cat_food UUID;
BEGIN
  SELECT id INTO v_ladakh_id FROM destinations WHERE slug = 'ladakh' AND country_id = (SELECT id FROM countries WHERE iso_code = 'IN');
  SELECT id INTO v_spiti_id FROM destinations WHERE slug = 'spiti-valley' AND country_id = (SELECT id FROM countries WHERE iso_code = 'IN');
  SELECT id INTO v_uttarakhand_id FROM destinations WHERE slug = 'uttarakhand' AND country_id = (SELECT id FROM countries WHERE iso_code = 'IN');
  SELECT id INTO v_kyoto_id FROM destinations WHERE slug = 'kyoto' AND country_id = (SELECT id FROM countries WHERE iso_code = 'JP');

  SELECT id INTO v_cat_mountains FROM categories WHERE slug = 'mountains-trekking';
  SELECT id INTO v_cat_road FROM categories WHERE slug = 'road-trips';
  SELECT id INTO v_cat_beaches FROM categories WHERE slug = 'beaches-islands';
  SELECT id INTO v_cat_nature FROM categories WHERE slug = 'nature-wildlife';
  SELECT id INTO v_cat_culture FROM categories WHERE slug = 'culture-heritage';
  SELECT id INTO v_cat_adventure FROM categories WHERE slug = 'adventure';
  SELECT id INTO v_cat_photo FROM categories WHERE slug = 'photography';
  SELECT id INTO v_cat_food FROM categories WHERE slug = 'food-local';

  -- Ladakh categories
  INSERT INTO destination_categories (destination_id, category_id) VALUES
    (v_ladakh_id, v_cat_mountains),
    (v_ladakh_id, v_cat_road),
    (v_ladakh_id, v_cat_nature),
    (v_ladakh_id, v_cat_culture),
    (v_ladakh_id, v_cat_adventure),
    (v_ladakh_id, v_cat_photo)
  ON CONFLICT DO NOTHING;

  -- Spiti Valley categories
  INSERT INTO destination_categories (destination_id, category_id) VALUES
    (v_spiti_id, v_cat_mountains),
    (v_spiti_id, v_cat_road),
    (v_spiti_id, v_cat_nature),
    (v_spiti_id, v_cat_culture),
    (v_spiti_id, v_cat_photo)
  ON CONFLICT DO NOTHING;

  -- Uttarakhand categories
  INSERT INTO destination_categories (destination_id, category_id) VALUES
    (v_uttarakhand_id, v_cat_mountains),
    (v_uttarakhand_id, v_cat_nature),
    (v_uttarakhand_id, v_cat_culture),
    (v_uttarakhand_id, v_cat_adventure),
    (v_uttarakhand_id, v_cat_photo),
    (v_uttarakhand_id, v_cat_food)
  ON CONFLICT DO NOTHING;

  -- Kyoto categories
  INSERT INTO destination_categories (destination_id, category_id) VALUES
    (v_kyoto_id, v_cat_culture),
    (v_kyoto_id, v_cat_photo),
    (v_kyoto_id, v_cat_food),
    (v_kyoto_id, v_cat_nature)
  ON CONFLICT DO NOTHING;
END $$;

-- ============================================
-- ATTRACTIONS (Sample for Ladakh)
-- ============================================

DO $$
DECLARE
  v_ladakh_id UUID;
BEGIN
  SELECT id INTO v_ladakh_id FROM destinations WHERE slug = 'ladakh' AND country_id = (SELECT id FROM countries WHERE iso_code = 'IN');

  INSERT INTO attractions (destination_id, name, slug, description, latitude, longitude, category) VALUES
    (v_ladakh_id, 'Pangong Tso', 'pangong-tso', 'High-altitude saltwater lake spanning India and China, famous for its changing colors', 33.7517, 78.6343, 'Lake'),
    (v_ladakh_id, 'Nubra Valley', 'nubra-valley', 'Cold desert with sand dunes, double-humped camels, and Diskit Monastery', 34.5467, 77.5447, 'Valley'),
    (v_ladakh_id, 'Leh Palace', 'leh-palace', '17th-century royal palace overlooking Leh town, similar to Potala Palace', 34.1685, 77.5803, 'Monument'),
    (v_ladakh_id, 'Thiksey Monastery', 'thiksey-monastery', '12-story monastery complex resembling Potala Palace, famous for Maitreya Buddha statue', 33.8542, 77.7112, 'Monastery'),
    (v_ladakh_id, 'Hemis Monastery', 'hemis-monastery', 'Largest and wealthiest monastery in Ladakh, famous for annual Hemis Festival', 34.0333, 77.6167, 'Monastery'),
    (v_ladakh_id, 'Khardung La', 'khardung-la', 'One of the world''s highest motorable passes at 5,359m', 34.2833, 77.5833, 'Mountain Pass'),
    (v_ladakh_id, 'Tso Moriri', 'tso-moriri', 'High-altitude lake in Changthang region, breeding ground for black-necked cranes', 32.8667, 78.3167, 'Lake'),
    (v_ladakh_id, 'Magnetic Hill', 'magnetic-hill', 'Gravity hill optical illusion where vehicles appear to roll uphill', 34.1747, 77.5167, 'Natural Phenomenon')
  ON CONFLICT (destination_id, slug) DO NOTHING;
END $$;

-- ============================================
-- DESTINATION IMAGES (Gallery)
-- ============================================

DO $$
DECLARE
  v_ladakh_id UUID;
  v_spiti_id UUID;
  v_uttarakhand_id UUID;
  v_kyoto_id UUID;
BEGIN
  SELECT id INTO v_ladakh_id FROM destinations WHERE slug = 'ladakh' AND country_id = (SELECT id FROM countries WHERE iso_code = 'IN');
  SELECT id INTO v_spiti_id FROM destinations WHERE slug = 'spiti-valley' AND country_id = (SELECT id FROM countries WHERE iso_code = 'IN');
  SELECT id INTO v_uttarakhand_id FROM destinations WHERE slug = 'uttarakhand' AND country_id = (SELECT id FROM countries WHERE iso_code = 'IN');
  SELECT id INTO v_kyoto_id FROM destinations WHERE slug = 'kyoto' AND country_id = (SELECT id FROM countries WHERE iso_code = 'JP');

  INSERT INTO destination_images (destination_id, url, alt_text, sort_order) VALUES
    (v_ladakh_id, '/images/destinations/ladakh-gallery-1.jpg', 'Pangong Tso at sunrise', 1),
    (v_ladakh_id, '/images/destinations/ladakh-gallery-2.jpg', 'Nubra Valley sand dunes with Bactrian camels', 2),
    (v_ladakh_id, '/images/destinations/ladakh-gallery-3.jpg', 'Thiksey Monastery against blue sky', 3),
    (v_ladakh_id, '/images/destinations/ladakh-gallery-4.jpg', 'Leh Palace overlooking the town', 4),
    (v_spiti_id, '/images/destinations/spiti-gallery-1.jpg', 'Key Monastery perched on hilltop', 1),
    (v_spiti_id, '/images/destinations/spiti-gallery-2.jpg', 'Chandratal Lake crescent shape', 2),
    (v_spiti_id, '/images/destinations/spiti-gallery-3.jpg', 'Pin Valley National Park landscape', 3),
    (v_spiti_id, '/images/destinations/spiti-gallery-4.jpg', 'Traditional Spitian house architecture', 4),
    (v_uttarakhand_id, '/images/destinations/uttarakhand-gallery-1.jpg', 'Valley of Flowers in full bloom', 1),
    (v_uttarakhand_id, '/images/destinations/uttarakhand-gallery-2.jpg', 'Ganga Aarti at Har Ki Pauri, Haridwar', 2),
    (v_uttarakhand_id, '/images/destinations/uttarakhand-gallery-3.jpg', 'Jim Corbett National Park tiger', 3),
    (v_uttarakhand_id, '/images/destinations/uttarakhand-gallery-4.jpg', 'Nainital lake with reflections', 4),
    (v_kyoto_id, '/images/destinations/kyoto-gallery-1.jpg', 'Kinkaku-ji Golden Pavilion reflection', 1),
    (v_kyoto_id, '/images/destinations/kyoto-gallery-2.jpg', 'Fushimi Inari thousand torii gates', 2),
    (v_kyoto_id, '/images/destinations/kyoto-gallery-3.jpg', 'Arashiyama Bamboo Grove path', 3),
    (v_kyoto_id, '/images/destinations/kyoto-gallery-4.jpg', 'Gion district traditional machiya houses', 4)
  ON CONFLICT DO NOTHING;
END $$;

-- ============================================
-- SAMPLE ITINERARY FOR LADAKH
-- ============================================

DO $$
DECLARE
  v_ladakh_id UUID;
  v_admin_id UUID;
  v_itinerary_id UUID;
BEGIN
  SELECT id INTO v_ladakh_id FROM destinations WHERE slug = 'ladakh' AND country_id = (SELECT id FROM countries WHERE iso_code = 'IN');
  -- Note: In real scenario, this would be a real user ID. Using a placeholder.
  -- v_admin_id would be obtained from auth.users

  -- This is a template - in production you'd link to actual user profiles
  -- INSERT INTO itineraries (...) VALUES (...);
END $$;