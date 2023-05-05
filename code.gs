const MODEL_TYPE = "gpt-3.5-turbo";
const OPENAI_API_KEY = PropertiesService.getScriptProperties().getProperty('OPENAI_API_KEY');

// example for short answers
function P(input) {
  const answer = callGPTApi(input, 10)
  return answer
}

// example for longer answers
function PLong(input) {
  const answer = callGPTApi(input, 100)
  return answer
}

// example for answers spanning multiple lines/cells
function PArray(input) {
  const answer = callGPTApi(input + 
  `\n  Answer with strings in JSON array format like this: \n 
  JSON: "[["item 1", "value of item 1", "another value of item 1"],["item 2", "value of item 2", "another value of item 2"]]"
JSON:`, 400)
 const array = JSON.parse(answer)
  return array
}

// example for input from multiple lines/cells with the last entry (last row, left cell) becoming the prompt
function SUMP(range) {
  if (!range) return "Invalid range";

  let entries = '';
  let lastEntry = '';

  for (let row = 0; row < range.length; row++) {
    if (row === range.length - 1) {
      lastEntry = range[row][0];
    } else {
      entries += range[row][0];

      if (row < range.length - 2) {
        entries += '\n';
      }
    }
  }
  const answer = callGPTApi(`${entries} \n ${lastEntry}`,100 )
  return answer
}

function callGPTApi(prompt, maxTokens) {
  const temperature = 0.83;

  const requestBody = {
    model: MODEL_TYPE,
    messages: [
      { role: "system", content: "" }, 
      { role: "user", content: "" + prompt }, 
    ],
    temperature: temperature,
    max_tokens: maxTokens,
  };

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + OPENAI_API_KEY,
    },
    payload: JSON.stringify(requestBody),
  };

  const response = UrlFetchApp.fetch("https://api.openai.com/v1/chat/completions", options);
  const responseText = response.getContentText();
  const json = JSON.parse(responseText);
  const generatedText = json['choices'][0]['message']['content'];
  return generatedText
}

