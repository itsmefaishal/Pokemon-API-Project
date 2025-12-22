Pokemon Research Lab
Live Link:

A high-performance web app for analyzing Pokemon data. Handles 1000+ rows smoothly with virtualized tables.

Setup

git clone (https://github.com/itsmefaishal/Pokemon-API-Project)
cd pokemon-research-lab
npm install
npm run dev
Open http://localhost:3000

About the Project:
Need to display large Pokemon data in a table without freezing the browser.


Tools/Libraries used:

TanStack
Zustand 
TanStack Query
PapaParse


Challenges faced:
1: Table was laggy with 1000+ rows
Tried rendering all rows → browser froze. 
Solution: TanStack Virtual renders only visible rows plus a few extras. Now it's smooth.

2: Fetching 1000+ Pokemon took forever
One-by-one was too slow. 
Solution: Batch requests (50 per/request). Dropped time from 20min to 3min.

3: Large CSV files crashed the browser
Loading a 50MB file into memory, it crash. 
Solution: Stream parsing with PapaParse. Memory stays at ~5MB no matter the file size.


Built with Next.js 14, TypeScript, Tailwind CSS

Author - Faishal Rahman