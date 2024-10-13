import { Room } from "./interfaces";

const words=[
    "the", "be", "to", "of", "and", "a", "in", "that", "have", "I", "it", "for", 
    "not", "on", "with", "he", "as", "you", "do", "at", "this", "but", "his", 
    "by", "from", "they", "we", "say", "her", "she", "or", "an", "will", "my", 
    "one", "all", "would", "there", "their", "what", "so", "up", "out", "if", 
    "about", "who", "get", "which", "go", "me", "when", "make", "can", "like", 
    "time", "no", "just", "him", "know", "take", "people", "into", "year", 
    "your", "good", "some", "could", "them", "see", "other", "than", "then", 
    "now", "look", "only", "come", "its", "over", "think", "also", "back", 
    "after", "use", "two", "how", "our", "work", "first", "well", "way", 
    "even", "new", "want", "because", "any", "these", "give", "day", "most", 
    "us","achievement", "appreciation", "availability", "background", "behaviour", 
  "celebration", "circumstance", "communication", "community", "consequence", 
  "consideration", "development", "disappointment", "environment", 
  "establishment", "experience", "extraordinary", "imagination", 
  "information", "independent", "individual", "inevitable", "inspiration", 
  "intelligence", "interpretation", "opportunity", "organization", 
  "participation", "performance", "perspective", "possibility", "preparation", 
  "recognition", "recommendation", "relationship", "representation", 
  "responsibility", "significance", "successful", "temperature", 
  "transformation", "understanding", "unfortunately", "university", 
  "vocabulary", "whenever", "wherever", "wonderful", "appreciation", 
  "competition", "congratulations", "determination", "enthusiastic", 
  "improvement", "maintenance", "philosophy", "psychology", "reliability", 
  "sophisticated", "technology", "theoretical", "understanding", "unbelievable", 
  "verification", "vulnerability", "awkward", "bizarre", "cyst", "dwarf", "fjord", "gnome", "glyph", 
  "jiffy", "jukebox", "knack", "lymph", "nymph", "pixel", "quartz", 
  "rhythmic", "sphinx", "twelfth", "unzip", "vexed", "whizz", "wrist", 
  "xenon", "zippy", "zonal", "flick", "crisp", "pluck", "prize", 
  "tryst", "waltz", "exempt", "glint", "hymn", "jumpy", "quirk", 
  "spunk", "stunt", "whisk", "zap", "zing", "quill", "fudge", "abrupt", "absurd", "affix", "axiom", "azure", "blitz", "bluff", "booze", 
  "buck", "chafe", "cliff", "cozy", "cramp", "crypt", "ditch", "elbow", 
  "equip", "exact", "expel", "fluff", "froth", "gauge", "gawk", "glitch", 
  "gnash", "grit", "gust", "hatch", "hunch", "jeep", "jerk", "jolt", 
  "jumbo", "kiosk", "latch", "lurch", "match", "mirth", "nudge", "pique", 
  "prong", "quash", "quip", "scalp", "scrub", "shirk", "sling", "snuff", 
  "spasm", "splat", "spunk", "squib", "stash", "stomp", "strut", "thump", 
  "tramp", "vouch", "whack", "whiff", "whirl", "wisp", "wrung", "yacht", 
  "zest", "zing", "zippy", "zilch", "zonal", "clamp", "brisk", "clink", 
  "drift", "flint", "glare", "grind", "lodge", "plumb", "prank", "scamp", 
  "shift", "slosh", "slink", "stack", "strum", "swamp", "twist", "vivid", 
  "whisk", "wring", "zipper", "zilch", "wreck", "frown", "glare", "stunt", 
  "twirl", "pluck", "grunt", "jumpy", "clutch", "hymn", "twitch", "prick", 
  "skimp", "fetch", "blurt", "smirk", "glint", "flick", "quirk", "balk", 
  "brisk", "crock", "dizzy", "flock", "grasp", "pluck", "scrap", "smack", 
  "spasm", "stiff", "tick", "tramp", "vex", "wisp","again", "against", "always", "answer", "beautiful", "because", "become", 
  "before", "begin", "behind", "believe", "between", "beyond", "brought", 
  "build", "busy", "caught", "certain", "could", "decide", "different", 
  "does", "doubt", "during", "early", "enough", "every", "family", "favorite", 
  "finally", "first", "friend", "great", "guess", "happened", "heard", 
  "instead", "knew", "knowledge", "learn", "listen", "minute", "money", 
  "most", "move", "often", "once", "other", "people", "piece", "please", 
  "really", "remember", "said", "school", "should", "since", "someone", 
  "something", "sometimes", "sorry", "special", "sure", "their", "there", 
  "though", "through", "thought", "today", "together", "tomorrow", "trouble", 
  "until", "useful", "usually", "watch", "whole", "whose", "woman", 
  "women", "would", "write", "wrong", "yourself"
];

export function randomText():string[]{
    
     // Generate a random number between 40 and 150
     const numberOfWords = Math.floor(Math.random() * (150 - 40 + 1)) + 40;
    
     const randomWordsSet:Set<string> = new Set();
     
     while (randomWordsSet.size < numberOfWords) {
         const randomIndex = Math.floor(Math.random() * words.length);
         randomWordsSet.add(words[randomIndex]);
     }
 
     return Array.from(randomWordsSet);

}

export function startGameWithCountdown(room: Room|undefined, countdownSeconds: number) {
    if(!room)
    {
        return;
    }
    let countdown:number = countdownSeconds;

    // Start a countdown interval that decreases every second
    const intervalId = setInterval(() => {
        if (countdown > 0) {
            // Send countdown update to all players
            broadcastToRoom(room, 'countdown', { count: countdown });
            countdown--;
        } else {
            // Countdown reached zero, start the game
            clearInterval(intervalId);
            broadcastToRoom(room,'game_start',{time:90}) // Call the function that actually starts the game
        }
    }, 1000); // 1000 ms = 1 second
}

export function broadcastToRoom(room: Room|undefined, type: string, payload: any) {
    room?.players.forEach(player => {
        player.socket.send(JSON.stringify({
            type:type,
            payload:{...payload}
        }));
    });
}