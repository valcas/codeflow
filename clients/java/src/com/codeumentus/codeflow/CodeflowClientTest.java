package com.codeumentus.codeflow;

import java.util.HashMap;
import java.util.Map;

public class CodeflowClientTest {

	public static void main(String[] args) {
		CodeflowClient cfc = new CodeflowClient();
		cfc.setCodeflowUrl("http://localhost:8081/log");
		Double procid = (Math.random() * 10000);
		Map<String, String> keys = new HashMap();
		keys.put("testkey1", "testvalue1");
		keys.put("testkey2", "testvalue2");
		cfc.sendTrigger("customer-flow", "check-form", String.valueOf(procid.intValue()), "test", keys);
	}

}
