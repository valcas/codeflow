package com.codeumentus.codeflow

import java.util.Date

import org.apache.http.HttpHeaders
import org.apache.http.client.methods.HttpPost
import org.apache.http.entity.StringEntity
import org.apache.http.impl.client.DefaultHttpClient

class CodeflowClient {

  var codeflowUrl : String = null;

  def sendTrigger(diagramid: String, stepname: String, processid: String, payload: String, keys: Map[String, String]) {

    try {

      new Thread(new Runnable() {
        def run() {

          val post = new HttpPost(codeflowUrl)
          post.addHeader(HttpHeaders.CONTENT_TYPE, "application/json")

          val keysJson = keys.toStream
            .map(e => "{\"id\":\"" + e._1 + "\", \"value\":\"" + e._2 + "\"}")
            .mkString("[", ", ", "]")

          val json: String =
            "{" +
              "\"diagramid\":\"" + diagramid + "\"," +
              "\"stepid\":\"" + stepname + "\"," +
              "\"action\":\"enter\"," +
              "\"processid\":\"" + processid + "\"," +
              "\"data\":\"" + payload + "\"," +
              "\"timestamp\":\"" + new Date().getTime() + "\"," +
              "\"keys\":" + keysJson +
              "}"

          post.setEntity(new StringEntity(json))
          val response = (new DefaultHttpClient).execute(post)

        }
      }).start

    } catch {
      case e: Exception => e.printStackTrace
    }
  }

}
