/**
 * Created by Yali on 5/18/17.
 */

// console.log('hello world');

function submit(){
	console.log('In submit entity');
	let entity = document.getElementById("entity").value;
	let summary = document.getElementById("summary").value;
	let hypo = document.getElementById("hypo").value;
	let date = new Date();
	console.log(date);
	
	console.log(entity);
	console.log(summary);
	console.log(hypo);
	
	$.post('submit',{doc1Id: 'CIA_26', doc2Id: 'FBI_16', entity: entity, summary: summary, hypo: hypo, date: date}, function(data, textStatus, jqXHR){
		console.log(data);
		$('#main').html(data);
	});
	
}
