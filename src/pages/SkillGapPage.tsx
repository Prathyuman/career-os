import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

import { auth, db } from "../lib/firebase";

import PageLayout from "../components/PageLayout";
import ScrollReveal from "../components/ScrollReveal";

import {
  Target,
  AlertTriangle,
  CheckCircle,
  Zap,
} from "lucide-react";

// TODO: Tomorrow replace hardcoded skills with Resume Analyzer + Gemini API

export default function SkillGapPage() {

  const [skillData, setSkillData] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      const docRef = doc(db, "resumeAnalysis", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setSkillData(docSnap.data());
        console.log("Skill Gap Data:", docSnap.data());
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <PageLayout title="Skill Gap Analysis">
      
      {/* Overview */}
      <ScrollReveal>
        <div className="bg-surface rounded-lg border border-border-subtle p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-coral/20 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-coral" />
            </div>

            <div>
              <h3 className="font-display font-semibold text-text-primary">
  Skill Gap Analysis
</h3>

              <p className="text-text-secondary text-sm mt-0.5">
  AI-generated skill gap report based on your uploaded resume.
</p>
            </div>
          </div>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

        {/* Current Skills */}
        <ScrollReveal>
          <div className="bg-surface rounded-lg border border-border-subtle p-6">
            <h3 className="font-display font-semibold text-text-primary mb-4 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-cyan" />
              Current Skills
            </h3>

            <div className="flex flex-wrap gap-2">
  {skillData?.currentSkills?.map((skill: string) => (
    <div
      key={skill}
      className="px-3 py-2 rounded-md bg-cyan/10 text-cyan"
    >
      {skill}
    </div>
  ))}
</div>
          </div>
        </ScrollReveal>

        {/* Skills Gap */}
        <ScrollReveal delay={0.1}>
          <div className="bg-surface rounded-lg border border-border-subtle p-6">
            <h3 className="font-display font-semibold text-text-primary mb-4 flex items-center gap-2">
              <Target className="w-4 h-4 text-coral" />
              Skills to Develop
            </h3>

            <div className="flex flex-wrap gap-2">

  {skillData?.missingSkills?.map((skill: string) => (
    <div
      key={skill}
      className="px-3 py-2 rounded-md bg-coral/10 text-coral"
    >
      {skill}
    </div>
  ))}
</div>
          </div>
        </ScrollReveal>
      </div>

      {/* Learning Recommendations */}
      <ScrollReveal>
        <div className="bg-surface rounded-lg border border-border-subtle p-6">
          <h3 className="font-display font-semibold text-text-primary mb-4 flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan" />
            Recommended Learning
          </h3>

          <div className="space-y-3">
  {skillData?.recommendedCourses?.length > 0 ? (
    skillData.recommendedCourses.map((course: string) => (
      <div
        key={course}
        className="p-3 rounded-md bg-elevated"
      >
        {course}
      </div>
    ))
  ) : (
    <div className="text-text-muted">
      No course recommendations available.
    </div>
  )}
</div>
          </div>
        
      </ScrollReveal>
      {/* Learning Roadmap */}
<ScrollReveal>
  <div className="bg-surface rounded-lg border border-border-subtle p-6 mt-6">
    <h3 className="font-display font-semibold text-text-primary mb-4">
      Learning Roadmap
    </h3>

    <div className="space-y-3">
  {skillData?.learningRoadmap?.length > 0 ? (
  skillData.learningRoadmap.map(
    (step: string, index: number) => (
      <div
        key={step}
        className="p-3 rounded-md bg-elevated"
      >
        <div className="text-cyan font-semibold mb-1">
          Phase {index + 1}
        </div>

        <div>{step}</div>
      </div>
    )
  )
) : (
  <div className="text-text-muted">
    No roadmap available.
  </div>
)}
</div>
  </div>
</ScrollReveal>
    </PageLayout>
  )
}