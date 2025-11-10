import { useState, useRef } from 'react'; 
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiFile, FiUpload, FiLoader, FiAlertTriangle, FiX, FiGithub, 
  FiUsers, FiUserPlus, FiStar, FiGitBranch, FiCode, FiBookOpen, 
  FiLink, FiTwitter, FiMapPin, FiCalendar 
} from 'react-icons/fi';

const StatCard = ({ icon, label, value }) => (
  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
    <div className="p-2 bg-blue-100 text-blue-600 rounded-full mr-3">
      {icon}
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="text-lg font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

const RepoCard = ({ data }) => (
  <motion.div
    layout
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.95 }}
    className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden"
  >
    <div className="p-5">
      <div className="flex justify-between items-start">
        <a href={data.url} target="_blank" rel="noopener noreferrer" className="block text-lg font-bold text-blue-600 hover:underline">
          {data.fullName}
        </a>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span className="flex items-center gap-1"><FiStar /> {data.stars.toLocaleString()}</span>
          <span className="flex items-center gap-1"><FiGitBranch /> {data.forks.toLocaleString()}</span>
        </div>
      </div>
      <p className="text-sm text-gray-600 mt-2 mb-4">{data.description}</p>
      <div className="flex items-center gap-4 text-sm">
        <span className="flex items-center gap-1.5"><FiCode /> {data.language || 'N/A'}</span>
        <span className="flex items-center gap-1.5"><FiBookOpen /> {data.license}</span>
      </div>
    </div>
    
    {data.topContributors.length > 0 && (
      <div className="border-t border-gray-200 bg-gray-50 px-5 py-4">
        <h4 className="font-semibold text-sm text-gray-700 mb-2">Top Contributors</h4>
        <div className="flex flex-wrap gap-2">
          {data.topContributors.map(c => (
            <a 
              key={c.login} 
              href={c.url}
              target="_blank" rel="noopener noreferrer"
              className="text-xs bg-gray-200 text-gray-800 px-2 py-1 rounded-full hover:bg-blue-100 hover:text-blue-700"
            >
              {c.login} ({c.commits})
            </a>
          ))}
        </div>
      </div>
    )}
  </motion.div>
);

const ProfileCard = ({ data }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden"
    >
      <div className="p-6">
        <div className="flex flex-col sm:flex-row gap-6">
          <img 
            src={data.avatar_url} 
            alt={data.name} 
            className="w-28 h-28 rounded-full border-4 border-gray-100 shadow-sm flex-shrink-0" 
          />
          <div className="flex-grow">
            <h2 className="text-2xl font-bold text-gray-900">{data.name}</h2>
            <a 
              href={data.url} 
              target="_blank" rel="noopener noreferrer"
              className="text-lg text-gray-500 font-light hover:text-blue-600"
            >
              @{data.username}
            </a>
            <p className="text-gray-700 my-3">{data.bio}</p>
            
            {/* Info Section */}
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-600">
              {data.company && <span className="flex items-center gap-1.5"><FiMapPin /> {data.company}</span>}
              {data.created_at && <span className="flex items-center gap-1.5"><FiCalendar /> Joined {data.created_at}</span>}
            </div>

            {/* Socials Section */}
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-blue-500 mt-3">
              {data.twitter && (
                <a 
                  href={`https://twitter.com/${data.twitter}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:underline"
                >
                  <FiTwitter /> @{data.twitter}
                </a>
              )}
              {data.blog && (
                <a 
                  href={data.blog.startsWith('http') ? data.blog : `https://${data.blog}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:underline"
                >
                  <FiLink /> {data.blog.replace(/https?:\/\//, '')}
                </a>
              )}
              {data.socials && data.socials.map(social => (
                <a 
                  key={social.provider}
                  href={social.url}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:underline capitalize"
                >
                  <FiLink /> {social.provider}
                </a>
              ))}
            </div>
          </div>
        </div>
        
        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <StatCard icon={<FiUsers />} label="Followers" value={data.followers.toLocaleString()} />
          <StatCard icon={<FiUserPlus />} label="Following" value={data.following.toLocaleString()} />
          <StatCard icon={<FiGithub />} label="Public Repos" value={data.public_repos.toLocaleString()} />
        </div>
        
        {/* --- UPDATED: README Section --- */}
        {data.profileReadme && (
          <div className="mt-6 border-t border-gray-200 pt-5">
            <h4 className="font-semibold text-gray-800 mb-2">Profile README</h4>
            {/* This renders the parsed HTML. 
              The 'prose' class from @tailwindcss/typography handles all styling.
            */}
            <div
              className="prose prose-sm prose-blue max-w-none text-gray-600"
              dangerouslySetInnerHTML={{ __html: data.profileReadme }}
            />
          </div>
        )}
      </div>
      
      {/* Top Repos Section */}
      {data.repos.length > 0 && (
        <div className="border-t border-gray-200 bg-gray-50 px-6 py-5">
          <h4 className="font-semibold text-gray-800 mb-3">Top Repositories</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {data.repos.map(repo => (
              <a 
                key={repo.name} 
                href={repo.url}
                target="_blank" rel="noopener noreferrer"
                className="block p-3 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
              >
                <p className="font-semibold text-blue-600 truncate">{repo.name}</p>
                <p className="text-xs text-gray-600 mt-1 truncate">{repo.description}</p>
                <div className="flex items-center gap-3 text-xs text-gray-500 mt-2">
                  <span className="flex items-center gap-1"><FiCode /> {repo.language || 'N/A'}</span>
                  <span className="flex items-center gap-1"><FiStar /> {repo.stars}</span>
                  <span className="flex items-center gap-1">Commits: {repo.commits}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default function Home() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('idle'); 
  const [errorMessage, setErrorMessage] = useState('');
  const [githubData, setGithubData] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  
  const handleSubmit = async (fileToProcess) => {
    if (!fileToProcess) return;

    clearFile();
    setFile(fileToProcess);
    setStatus('uploading');

    const formData = new FormData();
    formData.append('pdf', fileToProcess);

    try {
      const extractRes = await fetch('/api/extract', {
        method: 'POST',
        body: formData,
      });

      const extractData = await extractRes.json();
      if (!extractRes.ok) throw new Error(extractData.error);
      
      if (!extractData.links || extractData.links.length === 0) {
        setErrorMessage('No GitHub links were found in this PDF.');
        setStatus('error');
        return;
      }
      
      // Step 2: Fetch data from GitHub
      setStatus('fetching');
      const githubRes = await fetch('/api/github-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ links: extractData.links }),
      });

      const githubData = await githubRes.json();
      if (!githubRes.ok) throw new Error(githubData.error);
      
      setGithubData(githubData);
      setStatus('ready');
      
    } catch (err) {
      setErrorMessage(err.message);
      setStatus('error');
    }
  };

  // --- File Handlers ---
  
  const handleFileChange = (selectedFile) => {
    if (selectedFile && selectedFile.type === 'application/pdf') {
      handleSubmit(selectedFile); // Auto-submit
    } else if (selectedFile) {
      setErrorMessage('Invalid file type. Please upload a PDF.');
      setStatus('error');
      setFile(null);
    }
  };

  const handleDrop = (e) => {
    handleDragEvents(e, false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'application/pdf') {
      handleSubmit(droppedFile); // Auto-submit
    } else {
      setErrorMessage('Invalid file type. Please upload a PDF.');
      setStatus('error');
      setFile(null);
    }
  };

  const handleDragEvents = (e, dragging) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(dragging);
  };

  const clearFile = () => {
    setFile(null);
    setStatus('idle');
    setErrorMessage('');
    setGithubData([]);
    if(fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // --- UI Components ---

  const getLoadingMessage = () => {
    if (status === 'uploading') return 'Extracting links...';
    if (status === 'fetching') return 'Fetching GitHub data...';
    return 'Loading...';
  };

  const Uploader = () => (
    <motion.div
      layout
      onClick={() => fileInputRef.current.click()}
      onDragOver={(e) => handleDragEvents(e, true)}
      onDragLeave={(e) => handleDragEvents(e, false)}
      onDrop={handleDrop}
      className={`flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
        isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
      }`}
    >
      <FiUpload className="w-10 h-10 text-gray-400 mb-3" />
      <p className="text-gray-700 font-medium">Drag & drop your PDF here</p>
      <p className="text-gray-500 text-sm">or click to browse</p>
    </motion.div>
  );

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4 sm:p-8">
      
      {/* --- Uploader Card --- */}
      <div className="w-full max-w-2xl">
        <motion.div
          layout
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-xl overflow-hidden"
        >
          <div className="p-8">
            <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
              GitHub Data Extractor
            </h1>
            <p className="text-center text-gray-500 text-sm mb-6">
              Upload a PDF to extract GitHub profiles and repositories.
            </p>

            <input
              type="file" ref={fileInputRef}
              onChange={(e) => handleFileChange(e.target.files[0])}
              accept="application/pdf" className="hidden"
              disabled={status === 'uploading' || status === 'fetching'}
            />

            {/* --- Uploader or Loading State --- */}
            <div className="relative">
              <AnimatePresence>
                {(status === 'uploading' || status === 'fetching') && (
                  <motion.div
                    key="loader"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-10 flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-lg border-blue-500 bg-blue-50/80 backdrop-blur-sm"
                  >
                    <FiLoader className="animate-spin w-8 h-8 text-blue-600 mb-3" />
                    <p className="text-blue-700 font-medium">{getLoadingMessage()}</p>
                  </motion.div>
                )}
              </AnimatePresence>
              <Uploader />
            </div>

            {/* --- File Preview / Clear Button --- */}
            <AnimatePresence>
              {file && (
                <motion.div
                  layout
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg mt-6"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <FiFile className="w-6 h-6 text-red-500 flex-shrink-0" />
                    <span className="text-sm font-medium text-gray-700 truncate">{file.name}</span>
                  </div>
                  <button 
                    onClick={clearFile}
                    className="p-1 text-gray-400 hover:text-red-500 rounded-full"
                    title="Clear file"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* --- Error Message --- */}
            <AnimatePresence>
               {status === 'error' && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginTop: '1.5rem' }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  className="p-4 bg-red-50 border border-red-200 rounded-lg"
                >
                  <div className="flex items-center">
                    <FiAlertTriangle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" />
                    <p className="text-sm text-red-700">{errorMessage}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
      
      {/* --- Results Section --- */}
      <AnimatePresence>
        {status === 'ready' && githubData.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="w-full max-w-4xl mt-12 space-y-8"
          >
            <h2 className="text-2xl font-bold text-gray-800 text-center">
              Extracted Data
            </h2>
            {githubData.map((data) =>
              data.type === 'Profile' 
                ? <ProfileCard key={data.username} data={data} /> 
                : <RepoCard key={data.fullName} data={data} />
            )}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
