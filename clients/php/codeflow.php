<?php
/**
To use this class set the global variable "CODEFLOW_URL" and then import
this file.

--------------------------------------------
$GLOBALS["CODEFLOW_URL"] = "localhost:8081";
require_once('codeflow/codeflow.php');
--------------------------------------------

To call a trigger in Codeflow use the following...

(new Codeflow())->fire([DIAGRAM_NAME], [STEP_NAME], [PROCESS_ID], [DEBUG_INFO]);
*/

class Codeflow  {

  private $codeflowUrl = null;

  public function __construct() {
    global $GLOBALS;
    $this->codeflowUrl = $GLOBALS["CODEFLOW_URL"];
  }

  public function fire($diagramid, $stepname, $processid, $payload)  {

    $ts = explode(' ',microtime());
    $ts = $ts[0] + $ts[1];

    $data = array(
        "diagramid" => $diagramid,
        "stepid" => $stepname,
        "action" => "enter",
        "processid" => $processid,
        "data" => $payload,
        "timestamp" => $ts * 1000
    );

    $ch = curl_init();
    $ch = curl_init($this->codeflowUrl);

    $postString = http_build_query($data, '', '&');

    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $postString);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    $response = curl_exec($ch);
    curl_close($ch);

  }

}

?>
