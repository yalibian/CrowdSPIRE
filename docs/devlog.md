# Development Log

## Preparation
    * D3.js
    * React (How to connect with D3)
    * StartSPIRE


## Create a web-based StartSPIRE
    * Overview: 
        Menu bar at the header bar: file, edit, mode ...
        
        
    * Visual Mapping
        - Different visual elements for different data element: 
        - Documents can be shown as minimized rectangles, as well as full detail windows(big rectangles)
        - Circle for Searching key words. 
        - Calcuate the document similarity: based on cosine similarity. 
           
    * Interaction: Change the value of entities
        - Document movement: exploratory interaction
            - dragging: stop others. 
            - double-clicking: 
            - clicking the node: show links between this node and related nodes.
        - Highlighting: 
        
        
       rug如果卡的厉害，我可以尝试每次修改highlight的时候，重新插入一些lines 和 labels
       
        
    * visualize Document
        https://d3plus.org/examples/utilities/a39f0c3fc52804ee859a/
        https://www.w3.org/TR/SVGTiny12/text.html#TextInAnArea
        https://jsbin.com/zenomoziso/1/edit?html,js,output
        http://jsfiddle.net/meetamit/e38bLdjk/1/
        http://stackoverflow.com/questions/25783454/make-a-d3-div-resizable-by-drag
        
    * need a control panel: to help do the search work 
    * Load files from several kinds of file types:
        JSON file 
        jig file
        
    * INIT SEARCH FUNCTION
        When clicking search at menu bar, or typing "Command + f", pop out a dialog for searching, which could link which nodes, or other terms.
        

