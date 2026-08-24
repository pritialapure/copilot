export default function WorkflowGraph() {
  const stages = [
    { step: 1, label: 'Upload Resume', icon: '📄' },
    { step: 2, label: 'Parse Skills', icon: '🔍' },
    { step: 3, label: 'Discover Jobs', icon: '🌐' },
    { step: 4, label: 'Match Score', icon: '🎯' },
    { step: 5, label: 'Analyze Gaps', icon: '📊' },
    { step: 6, label: 'Create Plan', icon: '📋' },
    { step: 7, label: 'Apply Ready', icon: '✅' },
    { step: 8, label: 'Track Progress', icon: '🚀' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-soft p-8 border border-[#18212f]/10">
      <h2 className="text-2xl font-bold text-[#18212f] mb-6">8-Stage CareerPilot Pipeline</h2>
      
      <div className="hidden lg:block">
        {/* Desktop: Horizontal */}
        <div className="flex items-center justify-between">
          {stages.map((stage, idx) => (
            <div key={stage.step} className="flex-1">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-[#1f7a5c] to-[#15573f] text-white rounded-full flex items-center justify-center text-lg font-bold mb-2">
                  {stage.icon}
                </div>
                <p className="text-sm font-semibold text-[#18212f] text-center">{stage.label}</p>
                <p className="text-xs text-gray-500">Step {stage.step}</p>
              </div>
              {idx < stages.length - 1 && (
                <div className="flex-1 h-1 bg-gradient-to-r from-[#1f7a5c] to-gray-300 mx-2 mt-6" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Mobile: Vertical */}
      <div className="lg:hidden space-y-3">
        {stages.map((stage) => (
          <div key={stage.step} className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#1f7a5c] to-[#15573f] text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
              {stage.icon}
            </div>
            <div>
              <p className="text-sm font-semibold text-[#18212f]">{stage.label}</p>
              <p className="text-xs text-gray-500">Step {stage.step}</p>
            </div>
          </div>
        ))}
      </div>

      <p className="text-sm text-gray-600 mt-6 text-center">
        CareerPilot automates your internship journey with AI-powered discovery, matching, and skill-gap analysis.
      </p>
    </div>
  );
}
