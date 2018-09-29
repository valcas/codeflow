package com.codeumentus.codeflow;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Date;

public class CodeflowClient {
	
	public static void main(String[] args) {
		CodeflowClient cfc = new CodeflowClient();
		cfc.setCodeflowUrl("http://localhost:8081");
		Double procid = (Math.random() * 10000);
		cfc.sendTrigger("customer-flow", "check-form", String.valueOf(procid.intValue()), "test");
	}
	
	private String codeflowUrl;	

	public String getCodeflowUrl() {
		return codeflowUrl;
	}

	public void setCodeflowUrl(String codeflowUrl) {
		this.codeflowUrl = codeflowUrl;
	}

	public void sendTrigger(String diagramid, String stepname, String processid, String payload)	{
		
		try {
			
			new Thread(new Runnable() {
				
			    public void run() {
				
					try {
					
						URL url = new URL(codeflowUrl);
						HttpURLConnection con = (HttpURLConnection) url.openConnection();
			
						String urlParameters = 
								"diagramid=" + diagramid +
								"&stepid=" + stepname +
								"&action=enter" +
								"&processid=" + processid +
								"&data=" + payload +
								"&timestamp=" + (new Date()).getTime();
			
						con.setDoOutput(true);
						con.setRequestMethod("POST");
						DataOutputStream wr = new DataOutputStream(con.getOutputStream());
						wr.writeBytes(urlParameters);
						wr.flush();
						wr.close();
			
						BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream()));
						in.close();
						
					} catch (Exception e) {			
						e.printStackTrace();
					}
					
			    }

			}).start();
			
		} catch (Exception e) {
			e.printStackTrace();
		}
		
	}
	
}