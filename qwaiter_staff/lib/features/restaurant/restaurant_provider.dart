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
