import 'package:flutter/material.dart';
import 'auth_service.dart';

enum AuthStatus { idle, loading, error }

class AuthProvider extends ChangeNotifier {
  final AuthService _authService = AuthService();

  AuthStatus status = AuthStatus.idle;
  String? errorMessage;
  String? pendingEmail;

  // [] means optional
  void _setState(AuthStatus s, [String? error]) {
    status = s;
    errorMessage = error;
    notifyListeners();
  }

  Future<bool> workerLogin(String username, String password) async {
    _setState(AuthStatus.loading);
    try {
      await _authService.workerLogin(username, password);
      _setState(AuthStatus.idle);
      return true;
    } catch (e) {
      _setState(AuthStatus.error, e.toString());
      return false;
    }
  }

  Future<bool> ownerLogin(String email, String password) async {
    _setState(AuthStatus.loading);
    try {
      await _authService.ownerLogin(email, password);
      pendingEmail = email;
      _setState(AuthStatus.idle);
      return true;
    } catch (e) {
      _setState(AuthStatus.error, e.toString());
      return false;
    }
  }

  Future<bool> verifyLogin(String code) async {
    _setState(AuthStatus.loading);
    try {
      await _authService.verifyLogin(pendingEmail!, code);
      pendingEmail = null;
      _setState(AuthStatus.idle);
      return true;
    } catch (e) {
      _setState(AuthStatus.error, e.toString());
      return false;
    }
  }
}
