import 'package:dio/dio.dart';
import 'package:cookie_jar/cookie_jar.dart';
import 'package:dio_cookie_manager/dio_cookie_manager.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:path_provider/path_provider.dart';

/// Singleton Dio HTTP client with automatic cookie management.
/// Handles storing and sending the access_token cookie on every request.
class DioClient {
  static final DioClient _instance = DioClient._internal();
  factory DioClient() => _instance;

  late final Dio dio;
  late final PersistCookieJar cookieJar;

  DioClient._internal() {
    dio = Dio(
      BaseOptions(
        baseUrl: dotenv.env['API_URL'] ?? 'http://10.0.2.2:3000',
        connectTimeout: const Duration(seconds: 10),
        receiveTimeout: const Duration(seconds: 10),
        contentType: 'application/json',
      ),
    );
  }

  Future<void> init() async {
    final dir = await getApplicationDocumentsDirectory();
    cookieJar = PersistCookieJar(storage: FileStorage('${dir.path}/cookies/'));
    dio.interceptors.add(CookieManager(cookieJar));
  }
}
