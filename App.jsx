import { useState } from 'react';

export default function PlasmaFeedback() {
  const [text, setText] = useState('');
  const [feedback, setFeedback] = useState('');
  const [showReward, setShowReward] = useState(false);
  const [typing, setTyping] = useState(false);

  const randomChoice = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const randomRange = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  const generateFeedback = (text) => {
    const length = text.length;
    const lower = text.toLowerCase();
    const hasPlasma = lower.includes('plasma');
    const hasStablecoin = lower.includes('stablecoin');
    const mentionsCurrentEvents = /inflation|crisis|market|event|conference|crash/i.test(text);
    const hasOpinion = /i think|in my opinion|personally|imo/i.test(lower);
    const hasStats = /%|data|graph|statistics|numbers|figures/i.test(lower);

    const lengthShort = ["Your post is a bit short. Consider expanding to provide more depth."];
    const lengthLong = ["Nice length! You’ve provided enough content to engage your audience."];
    const relevanceYes = ["Your post is relevant to current events, which boosts visibility."];
    const relevanceNo = ["Try referencing recent events to improve engagement."];
    const qualityBoth = ["Good job including both Plasma and stablecoins — that’s spot on!"];
    const qualityPlasmaOnly = ["Mentioning Plasma is great. Don’t forget stablecoins too!"];
    const qualityStablecoinOnly = ["Talking about stablecoins is good. Add a Plasma mention to boost relevance."];
    const qualityNone = ["Try adding keywords like Plasma or stablecoins to better match our ecosystem."];
    const styleOpinion = ["Sharing your opinion makes the post more authentic."];
    const styleNoOpinion = ["Consider adding your perspective for a more personal touch."];

    let scoreLength = length < 150 ? randomRange(5, 10) : randomRange(15, 20);
    let scoreRelevance = mentionsCurrentEvents ? randomRange(15, 20) : randomRange(5, 10);
    let scoreStyle = hasOpinion ? randomRange(15, 20) : randomRange(5, 10);
    let scoreStats = hasStats ? randomRange(1, 3) : 0;

    let scoreQuality;
    if (hasPlasma && hasStablecoin) scoreQuality = randomRange(15, 20);
    else if (hasPlasma || hasStablecoin) scoreQuality = randomRange(8, 12);
    else scoreQuality = randomRange(3, 7);

    let totalScore = Math.round((scoreLength + scoreRelevance + scoreQuality + scoreStyle + scoreStats) / 5);

    let scFeedback = "\n\nSC Feedback:";
    let scNotes = [];
    if (!hasStablecoin) scNotes.push("Add stablecoin topics for better alignment.");
    if (!mentionsCurrentEvents) scNotes.push("Include recent events to enhance engagement.");
    if (!hasOpinion) scNotes.push("Include your perspective to strengthen the message.");
    if (!hasStats) scNotes.push("Include some statistics to back your ideas.");
    if (length < 150) scNotes.push("More content can make your post stronger.");

    const lengthFeedback = length < 150 ? randomChoice(lengthShort) : randomChoice(lengthLong);
    const relevanceFeedback = mentionsCurrentEvents ? randomChoice(relevanceYes) : randomChoice(relevanceNo);

    let qualityFeedback;
    if (hasPlasma && hasStablecoin) qualityFeedback = randomChoice(qualityBoth);
    else if (hasPlasma) qualityFeedback = randomChoice(qualityPlasmaOnly);
    else if (hasStablecoin) qualityFeedback = randomChoice(qualityStablecoinOnly);
    else qualityFeedback = randomChoice(qualityNone);

    const styleFeedback = hasOpinion ? randomChoice(styleOpinion) : randomChoice(styleNoOpinion);

    const selectedScNotes = scNotes.sort(() => 0.5 - Math.random()).slice(0, 3);
    scFeedback += "\n- " + selectedScNotes.join("\n- ");

    const finalFeedback = `${lengthFeedback}\n\n${relevanceFeedback}\n\n${qualityFeedback}\n\n${styleFeedback}${scFeedback}\n\nOverall score: ${totalScore} / 20`;

    return { feedback: finalFeedback, score: totalScore };
  };

  const typeEffect = (text, speed = 30, onComplete = null) => {
    setTyping(true);
    let i = 0;
    setFeedback('');

    function typing() {
      if (i < text.length) {
        setFeedback((prev) => prev + text.charAt(i));
        i++;
        setTimeout(typing, speed);
      } else {
        setTyping(false);
        if (onComplete) onComplete();
      }
    }

    typing();
  };

  const handleAnalyze = () => {
    setShowReward(false);
    if (!text.trim()) {
      setFeedback('Please write something to analyze.');
      return;
    }
    setFeedback('Generating feedback...');
    setTimeout(() => {
      const { feedback, score } = generateFeedback(text);
      typeEffect(feedback, 30, () => {
        if (score >= 11) setShowReward(true);
      });
    }, 500);
  };

  return (
    <div style={{ fontFamily: 'Segoe UI, sans-serif', backgroundColor: '#0D1117', color: '#E8E6E3', padding: 40, maxWidth: 800, margin: 'auto' }}>
      <h1 style={{ textAlign: 'center', color: '#58A6FF' }}>Plasma Post Feedback</h1>
      <textarea
        placeholder="Paste your Twitter post here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{
          width: '100%', height: 150, padding: 10, fontSize: 16,
          backgroundColor: '#161B22', color: '#E8E6E3', border: '1px solid #30363D', borderRadius: 6, marginBottom: 20
        }}
      />
      <div style={{ textAlign: 'center' }}>
        <button
          onClick={handleAnalyze}
          style={{ backgroundColor: '#238636', color: 'white', border: 'none', padding: '12px 24px', fontSize: 16, borderRadius: 6, cursor: 'pointer' }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#2EA043'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#238636'}
        >
          Analyze Post
        </button>
      </div>
      <div style={{ marginTop: 30, fontSize: 16, lineHeight: 1.6, whiteSpace: 'pre-line', opacity: typing ? 1 : 1 }}>
        {feedback}
      </div>
      {showReward && (
        <div style={{ marginTop: 20, textAlign: 'center' }}>
          <p style={{ color: '#E8E6E3', fontWeight: 'bold' }}>
            🎉 Congratulations, you did a good post and are able to access our Plasma faucet to reward your contribution
          </p>
          <a href="https://plasma-faucet-2-0.onrender.com" target="_blank">
            <button
              style={{ backgroundColor: '#3A6FA8', marginTop: 10, color: 'white', border: 'none', padding: '12px 24px', fontSize: 16, borderRadius: 6, cursor: 'pointer' }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#4C82C0'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#3A6FA8'}
            >
              Faucet
            </button>
          </a>
        </div>
      )}
    </div>
  );
}
