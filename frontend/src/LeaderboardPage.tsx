import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DeveloperReportDTO } from './types';
import { CircularProgress, Typography, Box } from "@mui/material";

const LeaderboardPage: React.FC = () => {
  const { owner, project } = useParams<{ owner: string; project: string }>();
  const navigate = useNavigate();
  
  const [data, setData] = useState<DeveloperReportDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!loading) {
      document.body.style.overflow = "auto";
      document.documentElement.style.overflow = "auto";
    } else {
      document.body.style.overflow = "hidden";
    }
  }, [loading]);

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:8080/gemini/analyze/${owner}/${project}`)
      .then((res) => {
        if (!res.ok) throw new Error("Backend not responding");
        return res.json();
      })
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Leaderboard fetch error:", err);
        setLoading(false);
      });
  }, [owner, project]);

  if (loading) return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh" bgcolor="#0d1117">
      <CircularProgress color="secondary" />
      <Typography sx={{ mt: 2, color: "white" }}>
        Analyzing {owner}/{project}... This can take up to 30 seconds.
      </Typography>
    </Box>
  );

  return (
    <div className="min-h-screen bg-[#0d1117] text-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <button 
          onClick={() => navigate(`/${owner}/${project}`)}
          className="mb-8 flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-md border border-gray-700 transition-colors"
        >
          <span>←</span> Back to Graph
        </button>

        <header className="mb-10">
          <h1 className="text-3xl font-extrabold tracking-tight">AI Review Analysis</h1>
          <p className="text-gray-400 mt-1">Detailed developer performance for project <strong>{project}</strong></p>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-500 mb-4"></div>
            <p className="text-gray-500 font-medium">Gemini is processing reviews...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.map((dev) => (
              <div 
                key={dev.username} 
                className={`flex gap-5 p-5 rounded-xl border transition-all hover:scale-[1.01] ${
                  dev.isSlacker ? 'border-red-900/50 bg-red-900/5' : 'border-gray-800 bg-gray-900/50'
                }`}
              >
                <img 
                  src={dev.avatarUrl} 
                  className="w-16 h-16 rounded-full border-2 border-blue-500/50 shadow-inner" 
                  alt={dev.username} 
                />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold">{dev.username}</h3>
                      <span className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">
                        Volume: {dev.workVolume}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-black text-blue-400 leading-none">{dev.valueScore}</span>
                      <span className="text-gray-600 text-xs ml-0.5">/10</span>
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm mt-3 leading-relaxed">
                    <span className="text-blue-500/50 text-xl font-serif">“</span>
                    {dev.advice}
                    <span className="text-blue-500/50 text-xl font-serif">”</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaderboardPage;
