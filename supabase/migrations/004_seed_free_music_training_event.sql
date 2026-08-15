-- Migration 004: Seed "1-Month Free Music Training" event from official flyer
-- Inserts or updates the Free Community Impact Program event into public.events

INSERT INTO public.events (
  title,
  slug,
  description,
  detailed_content,
  banner_url,
  date,
  start_time,
  end_time,
  venue_name,
  venue_address,
  status
)
VALUES (
  '1-Month Free Music Training (Free Community Impact Program)',
  '1-month-free-music-training',
  'Triumphant Harmony Brass presents a 1-Month Free Music Training — Free Community Impact Program. Duration: 3 days weekly for 4 weeks (1 Month), Time: 2:00 PM – 5:00 PM. Learn Keyboard, Guitar, Trumpet, Saxophone, Violin, Talking Drum, Drum Set, and Voice Training. Sponsored by Chief Samuel Olu Alabi (CDC Chairman, Ijaye Ojokoro) and led by Team Lead Taiwo Toyinbo. Contact: Call 070 3859 5356 / WhatsApp 0807 756 6475. Limited slots available!',
  '### Triumphant Harmony Brass — 1-Month Free Music Training

*The sound of victory, The heart of harmony.*

Join our **Free Community Impact Program** designed to empower aspiring musicians in Lagos with world-class foundational and advanced practical training across 8 core instruments.

#### 🗓️ Program Details & Schedule
- **Start Date**: 10th August (Ongoing 4-Week Program)
- **Duration**: 3 Days Weekly for 4 Weeks
- **Time**: 2:00 PM – 5:00 PM (Daily Sessions)
- **Venue**: 9/11, Olorunsogo Baptist Church, Ijaye Ojokoro, Lagos

#### 🎷 What You Will Learn
- **Keyboard / Piano**
- **Acoustic & Electric Guitar**
- **Trumpet & Brass Ensemble**
- **Saxophone**
- **Violin**
- **Talking Drum**
- **Drum Set & Percussion**
- **Vocal Techniques & Voice Training**

#### 🎖️ Program Leadership & Support
- **Sponsor**: Chief Samuel Olu Alabi (CDC Chairman, Ijaye Ojokoro)
- **Team Lead**: Taiwo Toyinbo (Founder & Music Director, THB Academy)

#### 📞 Registration & Enquiries
- **Phone**: 070 3859 5356
- **WhatsApp**: 0807 756 6475

*Limited slots available — First come, first served!*',
  '/images/events/free-music-training.jpg',
  '2026-08-10',
  '14:00:00',
  '17:00:00',
  'Olorunsogo Baptist Church',
  '9/11, Olorunsogo Baptist Church, Ijaye Ojokoro, Lagos',
  'published'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  detailed_content = EXCLUDED.detailed_content,
  banner_url = EXCLUDED.banner_url,
  date = EXCLUDED.date,
  start_time = EXCLUDED.start_time,
  end_time = EXCLUDED.end_time,
  venue_name = EXCLUDED.venue_name,
  venue_address = EXCLUDED.venue_address,
  status = EXCLUDED.status,
  updated_at = NOW();
