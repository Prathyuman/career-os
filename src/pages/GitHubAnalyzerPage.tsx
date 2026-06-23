import { useState, useEffect } from 'react'
import PageLayout from '../components/PageLayout'
import ScrollReveal from '../components/ScrollReveal'
import {
  Github,
  Users,
  BookOpen,
  UserPlus
} from 'lucide-react'

import { doc, setDoc, getDoc } from 'firebase/firestore'
import { db, auth } from '../lib/firebase'
export default function GitHubAnalyzerPage() {
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState<any>(null)
  const [repos, setRepos] = useState<any[]>([])
  const [aiAnalysis, setAiAnalysis] = useState<any>(null)
  const [error, setError] = useState('')
const loadGithubAnalysis = async (uid: string) => {

  console.log("Loading data for UID:", uid)

  const docRef = doc(db, 'githubAnalysis', uid)

  const docSnap = await getDoc(docRef)

  console.log("Document Exists:", docSnap.exists())

  if (docSnap.exists()) {

    const data = docSnap.data()

    console.log("LOADED DATA:", data)

    setUsername(data.githubUsername || '')
    setProfile(data.profile || null)
    setRepos(data.repos || [])

    setAiAnalysis({
      githubScore: data.githubScore,
      strengths: data.strengths,
      weaknesses: data.weaknesses,
      missingTechnologies: data.missingTechnologies,
      recommendedProjects: data.recommendedProjects
    })
  }
}
useEffect(() => {
  const unsubscribe = auth.onAuthStateChanged((user) => {
    if (user) {
      loadGithubAnalysis(user.uid)
    }
  })

  return () => unsubscribe()
}, [])
  const analyzeGithub = async () => {
    if (!username.trim()) {
      setError('Please enter a GitHub username')
      return
    }

    try {
      setLoading(true)
      setError('')
      setAiAnalysis(null)

      // Fetch GitHub Profile
      const profileRes = await fetch(
        `https://api.github.com/users/${username}`
      )

      if (!profileRes.ok) {
        throw new Error('GitHub user not found')
      }

      // Fetch Repositories
      const repoRes = await fetch(
        `https://api.github.com/users/${username}/repos`
      )

      const profileData = await profileRes.json()
      const repoData = await repoRes.json()

      setProfile(profileData)
      setRepos(repoData)

      // AI Analysis
      const aiRes = await fetch(
        'http://localhost:5000/analyze-github',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            profile: profileData,
            repos: repoData,
          }),
        }
      )

      console.log("AI Status:", aiRes.status)

const aiData = await aiRes.json()

console.log("AI DATA:", aiData)

setAiAnalysis(aiData)
const user = auth.currentUser

if (user) {
  await setDoc(
  doc(db, 'githubAnalysis', user.uid),
  {
    githubScore: aiData.githubScore,
    strengths: aiData.strengths,
    weaknesses: aiData.weaknesses,
    missingTechnologies: aiData.missingTechnologies,
    recommendedProjects: aiData.recommendedProjects,

    profile: profileData,
    repos: repoData,

    githubUsername: username,
    updatedAt: new Date()
  }
)
}
    } catch (err: any) {
      console.error(err)
      setError(err.message)
      setProfile(null)
      setRepos([])
      setAiAnalysis(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageLayout title="GitHub Analyzer">
      <ScrollReveal>
        <div className="max-w-4xl mx-auto">

          {/* Input Card */}
          <div className="bg-surface rounded-lg border border-border-subtle p-8 text-center">

            <Github className="w-14 h-14 text-text-muted mx-auto mb-4" />

            <h2 className="font-display text-2xl font-semibold text-text-primary mb-2">
              Analyze Your GitHub Profile
            </h2>

            <p className="text-text-secondary text-sm max-w-md mx-auto mb-6">
              Enter your GitHub username to analyze repositories,
              contributions, and coding skills.
            </p>

            <input
              type="text"
              placeholder="Enter GitHub Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full max-w-md px-4 py-3 rounded-lg bg-deep border border-border-subtle text-text-primary outline-none"
            />

            <button
              onClick={analyzeGithub}
              className="mt-5 px-6 py-3 rounded-md bg-cyan text-deep font-semibold hover:brightness-110 transition-all"
            >
              {loading ? 'Analyzing...' : 'Analyze GitHub'}
            </button>

            {error && (
              <p className="mt-4 text-red-500 text-sm">
                {error}
              </p>
            )}

          </div>

          {/* Profile Section */}
          {profile && (
            <div className="mt-8 bg-surface rounded-lg border border-border-subtle p-8">

              {/* Header */}
              <div className="flex flex-col md:flex-row items-center gap-6">

                <img
                  src={profile.avatar_url}
                  alt="Profile"
                  className="w-28 h-28 rounded-full border-4 border-cyan"
                />

                <div>
                  <h2 className="text-2xl font-bold text-text-primary">
                    {profile.name || profile.login}
                  </h2>

                  <p className="text-text-secondary">
                    @{profile.login}
                  </p>

                  <p className="text-text-secondary mt-2">
                    {profile.bio || 'No bio available'}
                  </p>

                  <a
                    href={profile.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-cyan text-sm mt-2 inline-block"
                  >
                    View GitHub Profile →
                  </a>
                </div>

              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">

                <div className="bg-deep rounded-lg p-5 border border-border-subtle">
                  <BookOpen className="mb-2" />
                  <p className="text-text-secondary text-sm">
                    Public Repositories
                  </p>
                  <h3 className="text-3xl font-bold">
                    {profile.public_repos}
                  </h3>
                </div>

                <div className="bg-deep rounded-lg p-5 border border-border-subtle">
                  <Users className="mb-2" />
                  <p className="text-text-secondary text-sm">
                    Followers
                  </p>
                  <h3 className="text-3xl font-bold">
                    {profile.followers}
                  </h3>
                </div>

                <div className="bg-deep rounded-lg p-5 border border-border-subtle">
                  <UserPlus className="mb-2" />
                  <p className="text-text-secondary text-sm">
                    Following
                  </p>
                  <h3 className="text-3xl font-bold">
                    {profile.following}
                  </h3>
                </div>

              </div>

              {/* Repository List */}
              <div className="mt-10">

                <h3 className="text-xl font-semibold mb-4">
                  Top Repositories
                </h3>

                <div className="space-y-4">

                  {repos.slice(0, 5).map((repo) => (
                    <div
                      key={repo.id}
                      className="bg-deep border border-border-subtle rounded-lg p-4"
                    >
                      <div className="flex justify-between items-center">

                        <div>
                          <h4 className="font-semibold text-text-primary">
                            {repo.name}
                          </h4>

                          <p className="text-text-secondary text-sm">
                            {repo.description || 'No description'}
                          </p>

                          <div className="flex gap-4 mt-2 text-sm text-text-secondary">
                            <span>⭐ {repo.stargazers_count}</span>
                            <span>🍴 {repo.forks_count}</span>
                            <span>💻 {repo.language || 'N/A'}</span>
                          </div>
                        </div>

                        <a
                          href={repo.html_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-cyan"
                        >
                          View →
                        </a>

                      </div>
                    </div>
                  ))}

                </div>
              </div>

              {/* AI Analysis */}
              {aiAnalysis && (
                <div className="mt-10 bg-deep rounded-lg border border-border-subtle p-6">

                  <h3 className="text-2xl font-bold mb-6">
                    AI GitHub Analysis
                  </h3>

                  <div className="mb-6">
                    <p className="text-text-secondary">
                      GitHub Score
                    </p>

                    <h2
  className={`text-5xl font-bold ${
    aiAnalysis.githubScore >= 70
      ? 'text-green-400'
      : aiAnalysis.githubScore >= 40
      ? 'text-yellow-400'
      : 'text-red-400'
  }`}
>
                      {aiAnalysis.githubScore}/100
                    </h2>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">

                    <div>
                      <h4 className="text-green-400 font-semibold mb-3">
                        Strengths
                      </h4>

                      <ul className="space-y-2">
                        {aiAnalysis.strengths?.map(
                          (item: string, index: number) => (
                           <li
  key={index}
  className="text-sm text-text-secondary leading-relaxed"
>
  ✅ {item}
</li>
                          )
                        )}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-red-400 font-semibold mb-3">
                        Weaknesses
                      </h4>

                      <ul className="space-y-2">
                        {aiAnalysis.weaknesses?.map(
                          (item: string, index: number) => (
                            <li key={index}>❌ {item}</li>
                          )
                        )}
                      </ul>
                    </div>

                  </div>

                  <div className="mt-8">
                    <h4 className="font-semibold mb-3">
                      Missing Technologies
                    </h4>

                    <div className="flex flex-wrap gap-2">
                      {aiAnalysis.missingTechnologies?.map(
                        (tech: string, index: number) => (
                          <span
                            key={index}
                            className="px-3 py-1 rounded-full bg-red-500/20 text-red-400"
                          >
                            {tech}
                          </span>
                        )
                      )}
                    </div>
                  </div>

                  <div className="mt-8">
                    <h4 className="font-semibold mb-3">
                      Recommended Projects
                    </h4>

                    <ul className="space-y-2">
                      {aiAnalysis.recommendedProjects?.map(
                        (project: string, index: number) => (
                          <li
  key={index}
  className="bg-surface p-3 rounded-lg border border-border-subtle"
>
  🚀 {project}
</li>
                        )
                      )}
                    </ul>
                  </div>

                </div>
              )}

            </div>
          )}

        </div>
      </ScrollReveal>
    </PageLayout>
  )
}