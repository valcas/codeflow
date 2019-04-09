package com.codeumentus.codeflow


object CodeflowClientTest {

  def main(args: Array[String]): Unit = {
    var cfc = new CodeflowClient();
    cfc.codeflowUrl = "http://localhost:8081/log";
    val r = scala.util.Random;
    val processid = r.nextInt(100000);
    val keys = Map("testkey1" -> "testvalue1", "testkey2" -> "testvalue2")
    cfc.sendTrigger("customer-flow", "check-form", processid.toString, "test", keys);
  }

}
