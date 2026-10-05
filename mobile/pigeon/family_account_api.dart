import 'package:pigeon/pigeon.dart';

@ConfigurePigeon(
  PigeonOptions(
    dartOut: 'lib/platform/family_account_api.g.dart',
    kotlinOut:
        'android/app/src/main/kotlin/app/alextran/immich/familyaccount/FamilyAccount.g.kt',
    kotlinOptions: KotlinOptions(package: 'app.alextran.immich.familyaccount'),
    dartOptions: DartOptions(),
    dartPackageName: 'immich_mobile',
  ),
)

class FamilyAccountSession {
  final String serverUrl;
  final String accessToken;
  final String? userName;

  const FamilyAccountSession({
    required this.serverUrl,
    required this.accessToken,
    this.userName,
  });
}

@HostApi()
abstract class FamilyAccountHostApi {
  @async
  FamilyAccountSession? getFamilyAccountSession();
}
