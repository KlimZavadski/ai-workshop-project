-- Add language code and translation columns to words table
alter table public.words
add column language_code text not null default 'en',
add column translated_word text;

-- Add comment for language_code column
comment on column public.words.language_code is 'ISO 639-1 language code (e.g., en, ru, es, fr)';

-- Add comment for translated_word column
comment on column public.words.translated_word is 'Word translated to the specified language';

-- Add constraint to ensure language_code follows ISO 639-1 format (2 characters)
alter table public.words
add constraint words_language_code_format
check (char_length(language_code) = 2);

-- Create index on language_code for better query performance
create index idx_words_language_code on public.words(language_code);
