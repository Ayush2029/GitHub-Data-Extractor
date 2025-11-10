import { marked } from 'marked';

const GITHUB_API_URL = 'https://api.github.com';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN; 

async function fetchGitHubAPI(endpoint) {
  try {
    const response = await fetch(`${GITHUB_API_URL}${endpoint}`, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });
    if (!response.ok) {
      if (response.status === 404) {
        console.warn(`404 Not Found for endpoint: ${endpoint}`);
        return null;
      }
      throw new Error(`GitHub API Error: ${response.status} ${await response.text()}`);
    }
    return response.json();
  } catch (error) {
    console.error(`Fetch error for endpoint ${endpoint}:`, error.message);
    return null;
  }
}

async function fetchReadme(owner, repo) {
  const readme = await fetchGitHubAPI(`/repos/${owner}/${repo}/readme`);
  if (!readme || !readme.content) return null;
  try {
    return Buffer.from(readme.content, 'base64').toString('utf8');
  } catch (e) {
    return null;
  }
}

function getBriefSummary(description, readmeContent) {
  if (description) {
    const html = marked.parse(description);
    const text = html.replace(/<[^>]*>/g, ' '); 
    return text.replace(/\s{2,}/g, ' ').trim(); 
  } 
  
  if (!readmeContent) return 'No description provided.';

  const html = marked.parse(readmeContent);
  const text = html.replace(/<[^>]*>/g, ' '); 
  const stripped = text.replace(/\s{2,}/g, ' ').trim(); 

  return stripped.substring(0, 250) + (stripped.length > 250 ? '...' : '');
}

async function getProfileData(username) {
  const user = await fetchGitHubAPI(`/users/${username}`);
  if (!user) return null;

  const socials = await fetchGitHubAPI(`/users/${username}/social_accounts`);
  const profileReadmeText = await fetchReadme(username, username);
  const repos = await fetchGitHubAPI(`/users/${username}/repos?type=all&sort=updated&per_page=100`);
  
  let processedRepos = [];
  if (repos) {
    const otherRepos = repos.filter(r => r.name.toLowerCase() !== username.toLowerCase());

    const repoDataPromises = otherRepos.map(async (repo) => {
      const contributors = await fetchGitHubAPI(`/repos/${repo.full_name}/contributors`);
      const readmeContent = await fetchReadme(repo.owner.login, repo.name);
      let userCommits = 0;
      
      if (contributors && Array.isArray(contributors)) {
        const userContrib = contributors.find(c => c.login.toLowerCase() === username.toLowerCase());
        userCommits = userContrib ? userContrib.contributions : 0;
      }
      
      return {
        name: repo.name,
        url: repo.html_url,
        description: getBriefSummary(repo.description, readmeContent),
        language: repo.language,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        commits: userCommits,
      };
    });
    processedRepos = await Promise.all(repoDataPromises);
    processedRepos.sort((a, b) => b.commits - a.commits || b.stars - a.stars);
  }

  return {
    type: 'Profile',
    name: user.name || user.login,
    username: user.login,
    bio: user.bio,
    url: user.html_url,
    avatar_url: user.avatar_url,
    followers: user.followers,
    following: user.following,
    public_repos: user.public_repos,
    company: user.company,
    blog: user.blog,
    twitter: user.twitter_username,
    socials: socials || [],
    created_at: new Date(user.created_at).toLocaleDateString(),
    profileReadme: profileReadmeText ? marked.parse(profileReadmeText) : null,
    repos: processedRepos.slice(0, 6),
  };
}

async function getRepoData(owner, repo) {
  const repoData = await fetchGitHubAPI(`/repos/${owner}/${repo}`);
  if (!repoData) return null;

  const contributors = await fetchGitHubAPI(`/repos/${owner}/${repo}/contributors`);
  const readmeContent = await fetchReadme(owner, repo);
  
  let topContributors = [];
  if (contributors && Array.isArray(contributors)) {
    topContributors = contributors.slice(0, 5).map(c => ({
      login: c.login,
      commits: c.contributions,
      url: c.html_url,
    }));
  }

  return {
    type: 'Repository',
    name: repoData.name,
    fullName: repoData.full_name,
    description: getBriefSummary(repoData.description, readmeContent),
    readme: readmeContent ? marked.parse(readmeContent) : null,
    url: repoData.html_url,
    owner: repoData.owner.login,
    stars: repoData.stargazers_count,
    forks: repoData.forks_count,
    language: repoData.language,
    license: repoData.license ? repoData.license.name : 'N/A',
    created_at: new Date(repoData.created_at).toLocaleDateString(),
    topContributors: topContributors,
  };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: 'Only POST requests allowed' });
  }

  const { links } = req.body;
  if (!links || !Array.isArray(links) || links.length === 0) {
    return res.status(400).json({ error: 'No links provided' });
  }

  try {
    const dataToRender = [];
    for (const url of links) {
      const match = url.match(/github\.com\/([^\/]+)(?:\/([^\/]+))?/);
      if (!match) continue;

      const user = match[1];
      const repo = match[2];

      if (repo) {
        if (user.toLowerCase() === repo.toLowerCase()) {
          continue; 
        }
        const data = await getRepoData(user, repo);
        if (data) dataToRender.push(data);
      } else {
        const data = await getProfileData(user);
        if (data) dataToRender.push(data);
      }
    }

    if (dataToRender.length === 0) {
      return res.status(500).json({ error: 'Could not fetch data for any valid links.' });
    }

    res.status(200).json(dataToRender);

  } catch (error) {
    console.error('Failed to fetch data:', error);
    res.status(500).json({ error: 'Failed to fetch GitHub data' });
  }
}
