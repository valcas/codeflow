package com.codeumentus.codeflow;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Date;
import java.util.Map;
import java.util.stream.Collectors;

public class CodeflowClient {

	private String codeflowUrl;	

	public String getCodeflowUrl() {
		return codeflowUrl;
	}

	public void setCodeflowUrl(String codeflowUrl) {
		this.codeflowUrl = codeflowUrl;
	}

	public void sendTrigger(String diagramid, String stepname, String processid, String payload, Map<String, String> keys)	{
		
		try {
			
			new Thread(new Runnable() {		
			    public void run() {
				
					try {
					
						URL url = new URL(codeflowUrl);
						HttpURLConnection con = (HttpURLConnection) url.openConnection();

						String keysJson = keys.entrySet().stream()
							.map(entry -> "{\"id\":\"" + entry.getKey() + "\", \"value\":\"" + entry.getValue() + "\"}")
							.collect(Collectors.joining(",", "[", "]"));
						
						String urlParameters = "{" +
								"\"diagramid\":\"" + diagramid + "\"," +
								"\"stepid\":\"" + stepname + "\"," +
								"\"action\":\"enter\"" + "," +
								"\"processid\":\"" + processid + "\"," +
								"\"data\":\"" + payload + "\"," +
								"\"timestamp\":\"" + (new Date()).getTime() + "\"," +
								"\"keys\":" + keysJson +
								"}";
			
						con.setRequestProperty("Content-Type", "application/json; charset=UTF-8");
						con.setDoOutput(true);
						con.setDoInput(true);
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