## GitHub-Data-Extractor
A web app that automatically extracts GitHub links from a PDF (like a resume or portfolio) and generates a rich, dynamic dashboard of profile and repository data. Built with Next.js and Tailwind CSS.

## Features
1) PDF Link Extraction: Upload any PDF document. The server scans it for all github.com hyperlinks.
2) Dynamic Data Dashboard: Fetches detailed GitHub API data for every profile and repository found.
3) Accurate Parsing: Intelligently parses profile and repository README.md files using marked and renders them as clean, styled HTML.
4) Modern UI/UX: A sleek, responsive, and animated UI built with Next.js, Tailwind CSS, and Framer Motion.
5) Automatic Upload: The app automatically processes the file on drop or selection—no extra "submit" button needed.

## Technology Stack

- Frontend:
1) Next.js (React): For server-side rendering and a powerful React framework.
2) Tailwind CSS: For utility-first styling.
3) @tailwindcss/typography: For beautifully styling the rendered Markdown HTML.
4) Framer Motion: For smooth page and component animations.
5) React Icons: For a clean icon set.

- Backend (Next.js API Routes):
1) pdfjs-dist: For server-side PDF parsing to extract annotations and links.
2) formidable: For robust handling of multipart/form-data file uploads.
3) marked: For converting Markdown into HTML.

## Project Structure

```bash
Github-Data-Extractor/
│
├── pages/
│   ├── api/
│   │   ├── extract.js       # API route: Handles PDF upload and link extraction.
│   │   └── github-data.js   # API route: Fetches and processes data from GitHub.
│   │
│   ├── _app.js              # Global App component (loads global CSS, fonts).
│   └── index.js             # The main page (Uploader UI and Results Display).
│
├── styles/
│   └── globals.css          # Tailwind CSS base styles.
│
├── .gitignore               # Files to ignore (e.g., node_modules, .env.local).
├── next.config.js           # Next.js configuration.
├── package.json             # Project metadata and dependencies.
├── package-lock.json        # Records exact dependency versions.
├── postcss.config.js        # Config for PostCSS (required by Tailwind).
└── tailwind.config.js       # Tailwind CSS config (adds typography plugin).

```

## Setup and Installation

Follow these instructions to get the project running on your local machine.
1. Prerequisites
- Node.js: v18.0 or later.
- npm: v9.0 or later (comes with Node.js).
- GitHub Personal Access Token: You must have a GitHub token for the API to work.
2. Installation
- Clone the Repository
```
git clone https://github.com/your-username/github-data-extractor.git
cd github-data-extractor
```
- Install Dependencies This command reads package.json and installs all the required libraries into the node_modules folder.
```
npm install
```
- Create Environment File You must create a local environment file to store your GitHub API token. This file is private and should never be committed to Git.
```
touch .env.local
```

Now, open the .env.local file and add your GitHub token.
How to get a GitHub Token:
1) Go to your GitHub Settings.
2) Go to Developer settings > Personal access tokens > Tokens (classic).
3) Click Generate new token.
4) Give it a name (e.g., "PDF Extractor Project") and set an expiration.
5) Select the public_repo scope.
6) Click Generate token and copy the token.

Add the copied token to your .env.local file:
GITHUB_TOKEN=ghp_YourSecretTokenGoesHere...

Step 4: Run the Development Server
```
npm run dev
```
The application will now be running at http://localhost:3000.

## Data Flow
1) User (Client): Uploads my_resume.pdf via the drag-and-drop UI.
2) Frontend (index.js):
- File is received. The status is set to uploading.
- A POST request is sent to /api/extract with the PDF file in a FormData object.
3) Backend (/api/extract.js):
- formidable parses the incoming file stream.
- pdfjs-dist opens the PDF file and iterates through all pages, reading their annotation data.
- It filters these annotations to find all URLs that include github.com.
- The API returns a JSON array of unique links: ["httpsfs://github.com/username", "https://github.com/username/repo"].
4) Frontend (index.js):
- Receives the array of links.
- If no links are found, it shows an error.
- If links are found, the status is set to fetching.
- A new POST request is sent to /api/github-data with the JSON array of links.
5) Backend (/api/github-data.js):
- Receives the array of links.
- It loops through the array, calling the official GitHub API for each link (using your GITHUB_TOKEN).
- It intelligently distinguishes between profiles (/users/...) and repositories (/repos/...).
- For each profile/repo, it fetches the raw README.md content.
- The raw Markdown is passed through the marked library to be safely converted into clean HTML.
- The API returns a large JSON array of objects, with each object containing all the profile/repo data and the parsed profileReadme HTML.
6) Frontend (index.js):
- Receives the final JSON data.
- The status is set to ready.
- The data is stored in state, causing React to render the <ProfileCard> and <RepoCard> components.
- The prose class (from @tailwindcss/typography) automatically styles the README HTML rendered with dangerouslySetInnerHTML
