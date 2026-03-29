import 'package:flutter/material.dart';
import 'restaurant_service.dart';

enum RestaurantStatus { idle, loading, error }

class Restaurant {
  final String id;
  final String name;
  final String address;

  const Restaurant({
    required this.id,
    required this.name,
    required this.address,
  });

  factory Restaurant.fromJson(Map<String, dynamic> json) => Restaurant(
    id: json['restaurantID'],
    name: json['restaurantName'],
    address: json['address'],
  );
}

class RestaurantProvider extends ChangeNotifier {
  final RestaurantService _service = RestaurantService();

  RestaurantStatus status = RestaurantStatus.idle;
  String? errorMessage;
  List<Restaurant> restaurants = [];

  void _setState(RestaurantStatus s, [String? error]) {
    status = s;
    errorMessage = error;
    notifyListeners();
  }

  Future<void> fetchRestaurants() async {
    _setState(RestaurantStatus.loading);
    try {
      final data = await _service.getRestaurant();
      restaurants = data.map((e) => Restaurant.fromJson(e)).toList();
      _setState(RestaurantStatus.idle);
    } catch (e) {
      _setState(RestaurantStatus.error, e.toString());
    }
  }

  Future<bool> createRestaurant(String name, String address) async {
    _setState(RestaurantStatus.loading);
    try {
      await _service.createRestaurant(name, address);
      await fetchRestaurants();
      return true;
    } catch (e) {
      _setState(RestaurantStatus.error, e.toString());
      return false;
    }
  }

  Future<bool> updateRestaurant(String id, String name, String address) async {
    _setState(RestaurantStatus.loading);
    try {
      await _service.updateRestaurant(id, name, address);
      await fetchRestaurants();
      return true;
    } catch (e) {
      _setState(RestaurantStatus.error, e.toString());
      return false;
    }
  }
}
