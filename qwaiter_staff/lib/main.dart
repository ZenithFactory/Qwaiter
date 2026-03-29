import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:qwaiter_staff/core/network/dio_client.dart';
import 'package:qwaiter_staff/core/router/app_router.dart';
import 'package:qwaiter_staff/features/auth/auth_provider.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:qwaiter_staff/features/restaurant/restaurant_provider.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await dotenv.load(fileName: '.env');
  await DioClient().init();
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()..checkAuth()),
        ChangeNotifierProvider(create: (_) => RestaurantProvider()),
      ],
      child: _AppWithRouter(),
    );
  }
}

class _AppWithRouter extends StatefulWidget {
  @override
  State<_AppWithRouter> createState() => _AppWithRouterState();
}

class _AppWithRouterState extends State<_AppWithRouter> {
  late final GoRouter _router;

  @override
  void initState() {
    super.initState();
    final auth = context.read<AuthProvider>();
    _router = AppRouter.router(auth);
    auth.addListener(_onAuthChanged);
  }

  void _onAuthChanged() {
    _router.refresh();
  }

  @override
  void dispose() {
    context.read<AuthProvider>().removeListener(_onAuthChanged);
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title: 'Qwaiter Staff',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
      ),
      routerConfig: _router,
    );
  }
}
