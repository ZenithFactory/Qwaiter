import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import 'package:qwaiter_staff/features/restaurant/restaurant_provider.dart';
import '../../auth/auth_provider.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final user = context.watch<AuthProvider>().currentUser;

    if (user == null) return const SizedBox.shrink();

    return user.isOwner ? const _OwnerHome() : const _WorkerHome();
  }
}

class _OwnerHome extends StatefulWidget {
  const _OwnerHome();

  @override
  State<_OwnerHome> createState() => _OwnerHomeState();
}

class _OwnerHomeState extends State<_OwnerHome> {
  @override
  void initState() {
    super.initState();
    Future.microtask(
      () => context
          .read<RestaurantProvider>()
          .fetchRestaurants(), // when screen loaded fetch restaurant
    );
  }

  void _showCreateSheet() {
    showModalBottomSheet(
      context: context,
      builder: (_) => const _RestaurantFormSheet(),
      isScrollControlled: true,
    );
  }

  void _showEditSheet(Restaurant restaurant) {
    showModalBottomSheet(
      context: context,
      builder: (_) => _RestaurantFormSheet(restaurant: restaurant),
      isScrollControlled: true,
    );
  }

  Future<void> _deleteRestaurant(String id) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Delete restaurant'),
        content: const Text('Are you sure?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx, false),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () => Navigator.pop(ctx, true),
            child: const Text('Delete'),
          ),
        ],
      ),
    );

    if (confirmed == true && mounted) {
      await context.read<RestaurantProvider>().deleteRestaurant(id);
    }
  }

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<RestaurantProvider>();

    return Scaffold(
      appBar: AppBar(
        title: const Text('My Restaurants'),
        actions: [
          IconButton(
            onPressed: () async {
              await context.read<AuthProvider>().logout();
            },
            icon: const Icon(Icons.logout),
          ),
        ],
      ),
      body: switch (provider.status) {
        RestaurantStatus.loading => const Center(
          child: CircularProgressIndicator(),
        ),
        RestaurantStatus.error => Center(
          child: Text(provider.errorMessage ?? 'Something went wrong'),
        ),
        RestaurantStatus.idle =>
          provider.restaurants.isEmpty
              ? const Center(child: Text('No restaurants yet'))
              : ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: provider.restaurants.length,
                  itemBuilder: (context, index) {
                    final r = provider.restaurants[index];
                    return Card(
                      margin: const EdgeInsets.only(bottom: 12),
                      child: ListTile(
                        title: ListTile(
                          title: Text(r.name),
                          subtitle: Text(r.address),
                          onTap: () => context.go('/restaurant/${r.id}'),
                          trailing: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              IconButton(
                                onPressed: () => _showEditSheet(r),
                                icon: const Icon(Icons.edit),
                              ),
                              IconButton(
                                onPressed: () => _deleteRestaurant(r.id),
                                icon: const Icon(Icons.delete),
                              ),
                            ],
                          ),
                        ),
                      ),
                    );
                  },
                ),
      },
      floatingActionButton: FloatingActionButton(
        onPressed: _showCreateSheet,
        child: const Icon(Icons.add),
      ),
    );
  }
}

class _RestaurantFormSheet extends StatefulWidget {
  final Restaurant? restaurant;

  const _RestaurantFormSheet({this.restaurant});

  @override
  State<_RestaurantFormSheet> createState() => _RestaurantFormSheetState();
}

class _RestaurantFormSheetState extends State<_RestaurantFormSheet> {
  late final TextEditingController _nameController;
  late final TextEditingController _addressController;

  @override
  void initState() {
    super.initState();
    _nameController = TextEditingController(text: widget.restaurant?.name);
    _addressController = TextEditingController(
      text: widget.restaurant?.address,
    );
  }

  @override
  void dispose() {
    _nameController.dispose();
    _addressController.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    final name = _nameController.text.trim();
    final address = _addressController.text.trim();
    final provider = context.read<RestaurantProvider>();

    bool success;

    if (widget.restaurant == null) {
      if (name.isEmpty || address.isEmpty) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Please fill in all fields')),
        );
        return;
      }
      success = await provider.createRestaurant(name, address);
    } else {
      success = await provider.updateRestaurant(
        widget.restaurant!.id,
        name,
        address,
      );
    }

    if (success && mounted) Navigator.pop(context);
    if (!success && mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(provider.errorMessage ?? 'Something went wrong'),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final isLoading =
        context.watch<RestaurantProvider>().status == RestaurantStatus.loading;
    final isEdit = widget.restaurant != null;

    return Padding(
      padding: EdgeInsets.only(
        left: 24,
        right: 24,
        top: 24,
        bottom: MediaQuery.of(context).viewInsets.bottom + 24,
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            isEdit ? 'Edit restaurant' : 'New restaurant',
            style: Theme.of(context).textTheme.titleLarge,
          ),
          const SizedBox(height: 16),
          TextField(
            controller: _nameController,
            decoration: const InputDecoration(labelText: 'Name'),
          ),
          const SizedBox(height: 12),
          TextField(
            controller: _addressController,
            decoration: const InputDecoration(labelText: 'Address'),
          ),
          const SizedBox(height: 24),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: isLoading ? null : _submit,
              child: isLoading
                  ? const CircularProgressIndicator()
                  : Text(isEdit ? 'Save' : 'Create'),
            ),
          ),
        ],
      ),
    );
  }
}

class _WorkerHome extends StatelessWidget {
  const _WorkerHome();

  @override
  Widget build(BuildContext context) {
    final user = context.watch<AuthProvider>().currentUser!;

    return Scaffold(
      appBar: AppBar(
        title: Text('Hello, ${user.username}'),
        actions: [
          IconButton(
            onPressed: () async {
              await context.read<AuthProvider>().logout();
            },
            icon: Icon(Icons.logout),
          ),
        ],
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text('Role: ${user.role}'),
            const SizedBox(height: 8),
            Text('Restaurant: ${user.restaurantID ?? 'N/A'}'),
          ],
        ),
      ),
    );
  }
}
