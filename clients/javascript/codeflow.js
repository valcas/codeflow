/**
To use this file set the global variable "CODEFLOW_URL" and then import
this file.

--------------------------------------------
<script>
var CODEFLOW_URL = 'http://localhost:8081';
</script>
<script type="text/javascript" src='codeflow.js'></script>
--------------------------------------------

To call a trigger in Codeflow use the following...

codeflow.fire([DIAGRAM_NAME], [STEP_NAME], [PROCESS_ID], [DEBUG_INFO]);
*/

function codeflowdef() {

  this.codeflowUrl = (typeof CODEFLOW_URL !== 'undefined') ? CODEFLOW_URL : null;

  this.setUrl = function(newurl) {
    this.codeflowUrl = newurl;
  }

  this.fire = function(diagramid, stepname, processid, payload, keys) {

    if ( ! this.codeflowUrl)  {
      return;
    }
    var request = new XMLHttpRequest();

    request.open('POST', this.codeflowUrl);
    request.setRequestHeader('Content-type','application/json');

    var payload = {
      "diagramid" : diagramid,
      "stepid" : stepname,
      "action" : "enter",
      "processid" : processid,
      "data" : payload,
      "timestamp" : new Date().getTime(),
      "keys" : keys
    };

    request.send(JSON.stringify(payload));

  }

}

var codeflow = new codeflowdef();
