# CrowdSpire: Crowdsourced based StarSpire



## KEY POINTS
start with simple prototype that uses semantic interaction to drive CW:
	drag 2 docs together
	query CW data from Tianyi
	display nodes & links, highlight entities in text
	semantic interaction to steer crowd slices in context

visualize crowd results in context
Expert + CW + ML 
Expert + CW:
start by replacing starspire ML with CW
semantic interaction CW micro-task ideas:
label cluster
extract keywords for cluster
make initial clusters
find docs relevant to a cluster
find connections between clusters
connecting documents
rating similarities

Study how crowd workers might help Experts?
have an expert do crescent using space to think
we watch and see if we can be helpful, if so how?  micro tasks can we do?
we be CW, see how we could help an expert while they work
ask expert how he wants our help as he works
expert could use Analyst Workspace
discover more micro-tasks


## Plan
	* Create a react based StarSpire like visualization

	1. CrowdSPIRE: StarSPIRE and ForceSPIRE share a flexible spatial workspace (driven by a modified force-directed layout) and several semantic interactions. Based on React and D3
	2. Using react and redux, together with the ACTION, to record the  Actions and find out the most appropriate interactions ask for Crowd-workers' help. 


Expert is using the big display workspace with StarSpire
Crowds are not using starspire, they use very simple microtask on mturk

1 explicitly directing the crowd:
expert can pose questions to the crowd in the workspace
how to design the interface that lets expert ask the questions, and visualize the results

2 implicitly directing the crowd:  semantic interaction

	a. replace existing starspire SI with crowds instead of ML
		a. user drags a doc A onto doc B:
			i. starspire: finds common terms between doc A & B, upweight those terms, queries relevant docs, move docs on screen, possibly doc C move to doc A/B
			ii. crowd:  find common theme (higher level concepts, not just terms) between doc A & B (new terms), find other docs related to doc A & B (other docs on the screen, other docs in the database), position new docs w.r.t. docs A & B in the workspace

	b. augment ML with crowds
		a. mix and match combinations of ML & crowd
		b. both, compare crowd to ML results, combine or show differences, show with different color
		c. crowd will be better at some tasks, ML better at others, so how to combine them in the best way?
		
	b. new SI for crowd
		a. expert creates multiple clusters, then crowd tries to find connectors between the clusters
		b. expert creates cluster, then crowd labels the cluster
	


## Purpose

The purpose is to make sure if crowdsourcing could empower visual analytics systems, and how should crowdsourcing empower the system

We did the simplest experiment: first, services from crowdsourcing workers should be real time, that could provides helps to experts (analysis system user), we mimic it.
1. In what level, the system shold work,
2. explicitly or implicitely: works well.
3. Get crowdsourcing systems first.

