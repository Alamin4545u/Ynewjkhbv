# Monetag Telegram Mini App

## ফাইল
- index.html – UI
- style.css – ডিজাইন (Telegram থিম অনুযায়ী)
- app.js – মূল লজিক (Zone ID সেভ + Monetag SDK লোড + অ্যাড শো)
- config.js – ডিফল্ট Zone ID, Admin ID, পয়েন্ট

## ব্যবহার
1. Monetag-এ Telegram Mini App সাইট/অ্যাপ যোগ করে Zone ID নিন।
2. ফাইলগুলো HTTPS হোস্টিংয়ে আপলোড করুন (GitHub Pages / Netlify / Vercel / Cloudflare Pages)।
3. Telegram-এ @BotFather → /newapp (বা Bot Settings → Menu Button) → আপনার HTTPS URL দিন।
4. অ্যাপ খুলে Settings-এ Zone ID বসিয়ে "সেভ করুন" চাপুন।
5. শুধু আপনি Settings দেখতে চাইলে config.js-এ ADMIN_IDS-এ আপনার Telegram ID দিন।

## নোট
- Zone ID Telegram CloudStorage ও localStorage-এ সংরক্ষিত হয়, যা প্রতি ইউজারের ডিভাইস/অ্যাকাউন্টে আলাদা। সব ইউজারের জন্য একই Zone চাইলে config.js-এর DEFAULT_ZONE_ID ব্যবহার করুন।
- পয়েন্ট শুধু ডেমো; আসল রিওয়ার্ডের জন্য Monetag Postback + নিজের সার্ভার ব্যবহার করুন।
https://alamin4545u.github.io/Ynewjkhbv/
