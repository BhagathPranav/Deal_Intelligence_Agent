# RocketRide Pipeline Definitions

To complete Phase 3, you will use the RocketRide visual builder in your Antigravity IDE to create three pipelines. Save them in this folder.

## 1. Strategy Pipeline (\`strategy.pipe\`)
This pipeline helps sales reps win active deals based on past learnings.

**Nodes to connect:**
1. **Input Node**
   - Fields: \`question\` (string), \`competitor\` (string)
2. **Neo4j/Cypher Node (HydraDB integration)**
   - Query: \`MATCH (d:Deal)-[:COMPETED_AGAINST]->(c:Competitor {name: $competitor}) RETURN d.id as deal_id\`
   - Parameters mapping: \`competitor\` -> \`input.competitor\`
3. **Hindsight Node**
   - Operation: \`Recall\`
   - Bank ID: \`deal-intelligence\`
   - Query: \`"How did we win or lose against " + input.competitor + " - context: " + input.question\`
4. **Groq LLM Node**
   - Model: \`openai/gpt-oss-120b\` (or any available Groq model)
   - Prompt: 
     \`\`\`text
     You are a Deal Intelligence Agent. 
     The rep is asking for advice: {{input.question}}
     
     Here are the memories from Hindsight about past deals against {{input.competitor}}:
     {{hindsight.results}}
     
     Provide a 3-bullet strategy on how to win this deal.
     \`\`\`
5. **Output Node**
   - Return: \`{{groq.output}}\`

---

## 2. Briefing Pipeline (\`briefing.pipe\`)
Generates a quick brief before a call.

**Nodes to connect:**
1. **Input Node**
   - Fields: \`account_name\` (string)
2. **Hindsight Node**
   - Operation: \`Reflect\`
   - Bank ID: \`deal-intelligence\`
   - Query: \`input.account_name\`
3. **Output Node**
   - Return: \`{{hindsight.reflection}}\`

---

## 3. Learning Pipeline (\`learning.pipe\`)
Triggers after a call to ingest new unstructured notes.

**Nodes to connect:**
1. **Input Node**
   - Fields: \`deal_id\` (string), \`notes\` (string)
2. **Hindsight Node**
   - Operation: \`Retain\`
   - Bank ID: \`deal-intelligence\`
   - Content: \`"Notes for deal " + input.deal_id + ": " + input.notes\`
3. **Output Node**
   - Return: \`{"status": "success"}\`
