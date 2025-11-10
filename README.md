# GitHub-Data-Extractor
A web app that automatically extracts GitHub links from a PDF (like a resume or portfolio) and generates a rich, dynamic dashboard of profile and repository data. Built with Next.js and Tailwind CSS.

# Features
1) PDF Link Extraction: Upload any PDF document. The server scans it for all github.com hyperlinks.

2) Dynamic Data Dashboard: Fetches detailed GitHub API data for every profile and repository found.

3) Accurate Parsing: Intelligently parses profile and repository README.md files using marked and renders them as clean, styled HTML.

4) Modern UI/UX: A sleek, responsive, and animated UI built with Next.js, Tailwind CSS, and Framer Motion.

5) Automatic Upload: The app automatically processes the file on drop or selection—no extra "submit" button needed.

# Technology Stack

- Frontend:

1) Next.js (React): For server-side rendering and a powerful React framework.

2) Tailwind CSS: For utility-first styling.

3) @tailwindcss/typography: For beautifully styling the rendered Markdown HTML.

4) Framer Motion: For smooth page and component animations.

5) React Icons: For a clean icon set.

- Backend (Next.js API Routes):

1) pdfjs-dist: For server-side PDF parsing to extract annotations and links.

2) formidable: For robust handling of multipart/form-data file uploads.

3) marked: For converting Markdown (like READMEs) into HTML.
