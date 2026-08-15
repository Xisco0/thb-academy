-- Migration 005: Add category column to instruments table if missing
ALTER TABLE public.instruments ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'General';
