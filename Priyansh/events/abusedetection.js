// गाली/गंदे शब्दों की लिस्ट
const badwords = [
  "madarchod","behenchod","randi","chutiya","bhosdike","gandu","gaand",
  "lavde","kamina","harami","ullu","fuck","mc","bc","suar","kutta",
  "kamchor","kutti","randwa","bkl","lund","lode","lavdi","rand","chinal"
];

const warns = {}; // warning याद रखने के लिए

module.exports = {
  config: {
    name: "auto.abuse",
    eventType: ["message"],
    version: "1.0.3",
    credits: "ANURAG",
    description: "गाली पकड़कर पहली बार चेतावनी और दूसरी बार बाहर कर देगा"
  },

  module.exports.run = async function({ api, event, Users }) {
    try {
      const { threadID, messageID, body, senderID } = event;
      if (!body) return;

      const lower = body.toLowerCase();

      // गाली detect करना
      if (badwords.some(word => lower.includes(word))) {
        if (!warns[threadID]) warns[threadID] = {};
        if (!warns[threadID][senderID]) warns[threadID][senderID] = 0;

        warns[threadID][senderID] += 1;

        const name = await Users.getNameUser(senderID);

        if (warns[threadID][senderID] === 1) {
          return api.sendMessage(
            `⚠️ चेतावनी ${name}!  
गाली या गंदे शब्द का इस्तेमाल मत करो।  
❗️अगर दुबारा किया तो तुम्हें Group से निकाल दिया जाएगा।`,
            threadID,
            messageID
          );
        } else {
          api.removeUserFromGroup(senderID, threadID, (err) => {
            if (err) {
              return api.sendMessage("❌ इस यूज़र को Group से हटाने में दिक्कत आई।", threadID);
            } else {
              return api.sendMessage(`🚫 ${name} ने दोबारा गाली दी, इसलिए उसे Group से निकाल दिया गया!`, threadID);
            }
          });
        }
      }
    } catch (e) {
      console.log(e);
    }
  }
};
