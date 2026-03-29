import 'package:dio/dio.dart';
import '../../core/network/dio_client.dart';

class RestaurantService {
  final Dio _dio = DioClient().dio;

  Future<List<dynamic>> getRestaurant() async {
    try {
      final response = await _dio.get('/user/restaurants');
      return response.data as List<dynamic>;
    } on DioException catch (e) {
      throw e.response?.data['message'] ?? 'Failed to fetch restaurants';
    }
  }
}
