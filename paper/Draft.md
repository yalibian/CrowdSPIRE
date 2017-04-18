# CrowdSPIRE: crowd-powered visual analytics sytem


## Paper motivation

expert needs help

combinatorics problem:  cant have crowd investigate all possible combinations



### Visual analytic
Only provide a really shollow level of visualization of sensemaking
limits of computational methods, algorithms, cant get semantics

#### for foraging part
How to find more related documets,

#### for synthesis part
How to find patterns .
#### External knowledge
human crowds can help with semantics, maybe specific domain expertise?



### Our Propose

use expert to guide the crowd, expert has overall problem expertise
managing the crowd is onerous
how to provide expert with management capability that is usable, fits into their sensemaking process
unified interface for managing algorithms and crowds
solution = semantic interaction



## Related Works

### Crowd-powered interface

### Semantic interaction

### Sensemaking


## Paper contributions
## System Pipeline
Ultimately, this system design will be a major step towards realizing our longer-term vision of developing powerful software tools to augment human intelligence and sensemaking. We envision an expert analyst working in a sensemaking environment that observes and dynamically responds to her reasoning process. As the expert begins working, certain sensemaking subtasks, e.g. foraging and synthesizing, can be spun off from the expert and performed by crowdworkers, or handled automatically, in parallel with the expert’s own investigation. The spin-off process may occur explicitly, initiated by the expert herself as a kind of crowd delegation, or implicitly, by the system analyzing her activities and generating predictions of promising lines of inquiry. The crowd might even direct itself, drawing on human intuition and hunches. As crowdworkers enter and leave their work environments, context slices allow them to complete tasks or pass on their works-in-progress to the next crowd. The completed results are integrated into the expert’s workspace in the appropriate context. Consequently, the expert is able to solve the sensemaking problem much more quickly, with lower total effort, than she could ordinarily.

As an example, an expert working in intelligence analysis may be investigating three different individuals suspected of being involved in a terrorist plot. He and his colleagues have collected a large corpus of potentially relevant documents including police reports, depositions, surveillance footage, and other materials. The expert launches our software on a computer with a large display and begins sifting through and grouping related documents. He puts three documents about Suspect 1 together to form a cluster, and makes another cluster with two documents related to Suspect 2. He begins work on Suspect 3. Meanwhile, the software begins seeking potential connections between suspects using both computational and crowd-based techniques. A data mining algorithm identifies simple connections between the suspects based on overlapping metadata, such as the fact that Suspects 1 and 2 live in the same state, but this connection is unimportant to the analyst. The software also recruits crowdworkers to examine the clusters and suggest potentially relevant connections between the two suspects and five documents. Buried deep in the documents is a surprising connection: both suspects own multiple luxury cars. The system highlights this crowd-identified relationship for the expert, who notices the update, and begins formulating a hypothesis about the two suspects working together and receiving a large payment.


## Automatic generate tasks based on semantic interaction

	1. how to use semantic interactions by expert to steer novice crowds (in addition to steers algorithms)
		a. input:  how to use semantic interaction as input to direct the crowd tasks
			i. can create several kinds of micro-tasks for each SI, some quick, some slow  (simulated in this paper with Tianyi data?)
				1) e.g. when expert drags 2 docs together:
					a) find entities that connect the 2 docs (quick)
					b) label semantic-level connections between the 2 docs (quick) -> text that can be used
					c) find related docs (slow)
						i) must compare to every other doc?
						ii) or use (a) and (b) to reduce the search set?  context slice?
				2) other SI ...
		b. output:  how to use crowd output in response to semantic interaction in the visualization
			i. can use crowd results in visualization (e.g. distance function for Force Directed layout)
			ii. can use crowd results in further algorithmic processing (e.g. search)
			iii. dynamic output, streaming from crowds


We provide instructions that may cue workers to certain attributes but we do not provide the worker with category definitions or examples.
The server platform creates new jobs for workers to do, posts them to Mechanical Turk, and collects answers.
TurKit is a Java/JavaScript API for running iterative tasks on Mechanical Turk.
Answers are announced on the client phone when they are received. Answers are also stored so that users can return to them in the future.

Define four levels of crowdsourcing on text analytics:
(A): find entities  the connect to documents
(B): Label semantic-level connections between to documents
(C): Find related docs
(D): Cluster documents


			
## Make use of outputs
different type of crowdsourcing tasks with different methods

### real-time tasks

### bached tasks

### steam tasks



## CrowdSPIRE
The crowdSPIRE mimic the several part of tasks right now. 



## case study
Comparison of crowd-enhanced version with algorithm-only version
	produces different insight?
	better insight???
	compare to Gold Standard Solution
	beyond simple keywords, semantics similarities
compare to previous user study cluster results?
