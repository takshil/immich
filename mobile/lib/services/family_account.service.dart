import 'dart:io';

import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:immich_mobile/platform/family_account_api.g.dart';

final familyAccountServiceProvider = Provider((ref) => FamilyAccountService());

class FamilyAccountService {
  final FamilyAccountHostApi? _hostApi;

  FamilyAccountService() : _hostApi = Platform.isAndroid ? FamilyAccountHostApi() : null;

  Future<FamilyAccountSession?> getSession() async {
    final api = _hostApi;
    if (api == null) {
      return null;
    }
    try {
      return await api.getFamilyAccountSession();
    } catch (_) {
      return null;
    }
  }
}
