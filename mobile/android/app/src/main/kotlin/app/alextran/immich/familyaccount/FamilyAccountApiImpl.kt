package app.alextran.immich.familyaccount

import android.content.Context
import android.net.Uri

class FamilyAccountApiImpl(private val context: Context) : FamilyAccountHostApi {
  companion object {
    private const val AUTHORITY = "famille.store.immich.session"
    private const val COL_SERVER_URL = "server_url"
    private const val COL_ACCESS_TOKEN = "access_token"
    private const val COL_USER_NAME = "user_name"
  }

  override fun getFamilyAccountSession(callback: (Result<FamilyAccountSession?>) -> Unit) {
    try {
      val uri = Uri.parse("content://$AUTHORITY/sessions")
      context.contentResolver.query(uri, null, null, null, null)?.use { cursor ->
        if (cursor.moveToFirst()) {
          val serverIdx = cursor.getColumnIndex(COL_SERVER_URL)
          val tokenIdx = cursor.getColumnIndex(COL_ACCESS_TOKEN)
          val nameIdx = cursor.getColumnIndex(COL_USER_NAME)
          val serverUrl = if (serverIdx >= 0) cursor.getString(serverIdx) else null
          val token = if (tokenIdx >= 0) cursor.getString(tokenIdx) else null
          val userName = if (nameIdx >= 0) cursor.getString(nameIdx) else null
          if (!serverUrl.isNullOrBlank() && !token.isNullOrBlank()) {
            callback(
              Result.success(
                FamilyAccountSession(
                  serverUrl = serverUrl,
                  accessToken = token,
                  userName = userName,
                ),
              ),
            )
            return
          }
        }
      }
      callback(Result.success(null))
    } catch (e: Exception) {
      callback(Result.success(null))
    }
  }
}
