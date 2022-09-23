// SCRIPT INCLUDE
// 'name' : example_rest_egress
// client_callable : true

var example_rest_egress = Class.create();
example_rest_egress.prototype = Object.extendsObject(AbstractAjaxProcessor, {
	get: function () {
		// try catch cause... lets keep our errors on the backend to stay in the backend. 
		try {
			var request  =  new sn_ws.RESTMessageV2(); // properties of this class take a name and method, to instantiate existing System Web Services
			// we're not defining any properties because we want to make a custom one in just this script. 
			request.setHttpMethod('get');
			// the destination endpoint, this is going to return us our frivolous data
			request.setEndpoint('https://randomuser.me/api/');
			// lets us define various header details
			request.setRequestHeader('Content-Type', "application/json");
			// runs the fetch request and saves it to a variable
			var response = request.execute();
			var data = response.getBody();
			gs.info('PARSING USER DATA');
			gs.info(data);
			data = JSON.parse(data);
			if(data.results.length == null) {
				gs.info('RESTMessageV2 returned invalid value');
				return JSON.stringify({ invalid : true });
			} else {
				return JSON.stringify({ name : data.results[0].name.first  + " " + data.results[0].name.last });
			}
			
		} catch(err) {
			var message = err.getMessage();
			gs.info(message);
		}
		
	},
    type: 'example_rest_egress'
});

// CLIENT SCRIPT
// on load this will run glideajax to ge the data from the exampel_rest_egress script include
// 'name' : incident_onLoad
function onLoad() {
    //Type appropriate comment here, and begin script below
     var ga = new GlideAjax('example_rest_egress');
     // define what value from out scriptinclude we're using in this case
     // we're going to call the "get" value in example_rest_egress which is our function
     ga.addParam('sysparm_name', 'get');
     // additionally we can pass paramters to the serverside script
     // ga.addParam('sysparm_PARAMETERNAMEHERE', 'PARAMATER VALUE');
     ga.getXML(callScriptInclude);
     
     
     function callScriptInclude(response) {
         var answer = response.responseXML.documentElement.getAttribute("answer");
         // log value before parsing to make sure we're actually parsing something
         jslog(answer);
         answer = JSON.parse(answer);
         // lets log what it looks like after we parsed it
         jslog(answer.name); // we expect the answer to be an object with a name key in it. 
         // now lets set the value of description to the answer.name
         g_form.setValue('description', answer.name);
     }
 }