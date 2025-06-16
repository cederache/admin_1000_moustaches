import { MigrationInterface, QueryRunner } from "typeorm";

export class HostFamilyAvailable1749564566159 implements MigrationInterface {
  name = "HostFamilyAvailable1749564566159";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`host_family\` ADD \`isAvailable\` tinyint NULL DEFAULT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`veterinarian\` CHANGE \`phone\` \`phone\` varchar(255) NULL DEFAULT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`veterinarian\` CHANGE \`mail\` \`mail\` varchar(255) NULL DEFAULT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`veterinarian\` CHANGE \`emergencies\` \`emergencies\` varchar(255) NULL DEFAULT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`veterinarian\` CHANGE \`appointmentConfirmationProcedure\` \`appointmentConfirmationProcedure\` varchar(255) NULL DEFAULT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`veterinarian\` CHANGE \`invoicePaymentDate\` \`invoicePaymentDate\` varchar(255) NULL DEFAULT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`veterinarian\` CHANGE \`paymentMethod\` \`paymentMethod\` varchar(255) NULL DEFAULT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`veterinarian\` CHANGE \`address\` \`address\` varchar(255) NULL DEFAULT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`veterinarian\` CHANGE \`latitude\` \`latitude\` int NULL DEFAULT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`veterinarian\` CHANGE \`longitude\` \`longitude\` int NULL DEFAULT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`veterinarian\` CHANGE \`priceLevel\` \`priceLevel\` int NULL DEFAULT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`animal_host_family\` CHANGE \`entryDate\` \`entryDate\` timestamp NULL DEFAULT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` CHANGE \`name\` \`name\` varchar(255) NULL DEFAULT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` CHANGE \`firstname\` \`firstname\` varchar(255) NULL DEFAULT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` CHANGE \`email\` \`email\` varchar(255) NULL DEFAULT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` CHANGE \`isReferent\` \`isReferent\` tinyint NULL DEFAULT FALSE`
    );
    await queryRunner.query(
      `ALTER TABLE \`host_family\` CHANGE \`phone\` \`phone\` varchar(255) NULL DEFAULT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`host_family\` CHANGE \`mail\` \`mail\` varchar(255) NULL DEFAULT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`host_family\` CHANGE \`socialNetworkAlias\` \`socialNetworkAlias\` varchar(255) NULL DEFAULT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`host_family\` CHANGE \`address\` \`address\` varchar(255) NULL DEFAULT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`host_family\` CHANGE \`latitude\` \`latitude\` int NULL DEFAULT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`host_family\` CHANGE \`longitude\` \`longitude\` int NULL DEFAULT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`host_family\` CHANGE \`driverLicense\` \`driverLicense\` tinyint NULL DEFAULT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`host_family\` CHANGE \`hasVehicule\` \`hasVehicule\` tinyint NULL DEFAULT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`host_family\` CHANGE \`nbChildren\` \`nbChildren\` int NULL DEFAULT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`host_family\` CHANGE \`childrenInfos\` \`childrenInfos\` varchar(255) NULL DEFAULT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`host_family\` CHANGE \`animalsInfos\` \`animalsInfos\` varchar(255) NULL DEFAULT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`host_family\` CHANGE \`canProvideVeterinaryCare\` \`canProvideVeterinaryCare\` tinyint NULL DEFAULT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`host_family\` CHANGE \`canProvideSociabilisation\` \`canProvideSociabilisation\` tinyint NULL DEFAULT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`host_family\` CHANGE \`canHostDisableAnimal\` \`canHostDisableAnimal\` tinyint NULL DEFAULT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`host_family\` CHANGE \`canProvideNightCare\` \`canProvideNightCare\` tinyint NULL DEFAULT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`host_family\` CHANGE \`observations\` \`observations\` varchar(255) NULL DEFAULT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`host_family\` CHANGE \`housingInformations\` \`housingInformations\` varchar(255) NULL DEFAULT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`host_family\` CHANGE \`canIsolate\` \`canIsolate\` tinyint NULL DEFAULT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`host_family\` CHANGE \`hostConditions\` \`hostConditions\` varchar(255) NULL DEFAULT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`host_family\` CHANGE \`onBreak\` \`onBreak\` tinyint NULL DEFAULT FALSE`
    );
    await queryRunner.query(
      `ALTER TABLE \`host_family\` CHANGE \`membershipUpToDate\` \`membershipUpToDate\` tinyint NULL DEFAULT FALSE`
    );
    await queryRunner.query(
      `ALTER TABLE \`host_family\` CHANGE \`isTemporary\` \`isTemporary\` tinyint NULL DEFAULT FALSE`
    );
    await queryRunner.query(
      `ALTER TABLE \`host_family\` CHANGE \`situation\` \`situation\` varchar(255) NULL DEFAULT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`animal\` CHANGE \`sexe\` \`sexe\` varchar(255) NULL DEFAULT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`animal\` CHANGE \`race\` \`race\` varchar(255) NULL DEFAULT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`animal\` CHANGE \`birthdate\` \`birthdate\` datetime NULL DEFAULT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`animal\` CHANGE \`entryDate\` \`entryDate\` datetime NULL DEFAULT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`animal\` CHANGE \`distinctiveSigns\` \`distinctiveSigns\` varchar(255) NULL DEFAULT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`animal\` CHANGE \`reasonForCare\` \`reasonForCare\` varchar(255) NULL DEFAULT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`animal\` CHANGE \`placeOfCare\` \`placeOfCare\` varchar(255) NULL DEFAULT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`animal\` CHANGE \`careInfos\` \`careInfos\` varchar(255) NULL DEFAULT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`animal\` CHANGE \`exitDate\` \`exitDate\` datetime NULL DEFAULT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`animal\` CHANGE \`exitReason\` \`exitReason\` varchar(255) NULL DEFAULT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`animal\` CHANGE \`exitInfos\` \`exitInfos\` varchar(255) NULL DEFAULT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`animal\` CHANGE \`deathDate\` \`deathDate\` datetime NULL DEFAULT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`animal\` CHANGE \`deathReason\` \`deathReason\` varchar(255) NULL DEFAULT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`animal\` CHANGE \`sterilised\` \`sterilised\` tinyint NULL DEFAULT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`animal\` CHANGE \`firstVaccinationDate\` \`firstVaccinationDate\` datetime NULL DEFAULT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`animal\` CHANGE \`secondVaccinationDate\` \`secondVaccinationDate\` datetime NULL DEFAULT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`animal\` CHANGE \`fivNegative\` \`fivNegative\` tinyint NULL DEFAULT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`animal\` CHANGE \`felvNegative\` \`felvNegative\` tinyint NULL DEFAULT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`animal\` CHANGE \`healthIssues\` \`healthIssues\` varchar(255) NULL DEFAULT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`animal\` CHANGE \`behaviour\` \`behaviour\` varchar(255) NULL DEFAULT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`animal\` CHANGE \`needFriends\` \`needFriends\` tinyint NULL DEFAULT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`animal\` CHANGE \`posture\` \`posture\` varchar(255) NULL DEFAULT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`animal\` CHANGE \`catsOk\` \`catsOk\` tinyint NULL DEFAULT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`animal\` CHANGE \`dogsOk\` \`dogsOk\` tinyint NULL DEFAULT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`animal\` CHANGE \`kidsOk\` \`kidsOk\` tinyint NULL DEFAULT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`animal\` CHANGE \`behaviorParticularity\` \`behaviorParticularity\` varchar(255) NULL DEFAULT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`animal\` CHANGE \`adopted\` \`adopted\` tinyint NULL DEFAULT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`animal\` CHANGE \`broadcastable\` \`broadcastable\` tinyint NULL DEFAULT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`animal\` CHANGE \`bookable\` \`bookable\` tinyint NULL DEFAULT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`animal\` CHANGE \`needExternalAccess\` \`needExternalAccess\` tinyint NULL DEFAULT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`animal\` CHANGE \`transferor\` \`transferor\` varchar(255) NULL DEFAULT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`animal\` CHANGE \`antiParasiticDate\` \`antiParasiticDate\` datetime NULL DEFAULT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`animal\` CHANGE \`transferCertificate\` \`transferCertificate\` tinyint NULL DEFAULT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`animal\` CHANGE \`reserved\` \`reserved\` tinyint NULL DEFAULT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`animal\` CHANGE \`needIcadDuplicate\` \`needIcadDuplicate\` varchar(255) NULL DEFAULT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`animal\` CHANGE \`contractSent\` \`contractSent\` tinyint NULL DEFAULT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`animal\` CHANGE \`albumCreated\` \`albumCreated\` tinyint NULL DEFAULT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`veterinarian_intervention\` CHANGE \`description\` \`description\` varchar(255) NULL DEFAULT NULL`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`veterinarian_intervention\` CHANGE \`description\` \`description\` varchar(255) NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`animal\` CHANGE \`albumCreated\` \`albumCreated\` tinyint NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`animal\` CHANGE \`contractSent\` \`contractSent\` tinyint NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`animal\` CHANGE \`needIcadDuplicate\` \`needIcadDuplicate\` varchar(255) NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`animal\` CHANGE \`reserved\` \`reserved\` tinyint NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`animal\` CHANGE \`transferCertificate\` \`transferCertificate\` tinyint NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`animal\` CHANGE \`antiParasiticDate\` \`antiParasiticDate\` datetime NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`animal\` CHANGE \`transferor\` \`transferor\` varchar(255) NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`animal\` CHANGE \`needExternalAccess\` \`needExternalAccess\` tinyint NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`animal\` CHANGE \`bookable\` \`bookable\` tinyint NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`animal\` CHANGE \`broadcastable\` \`broadcastable\` tinyint NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`animal\` CHANGE \`adopted\` \`adopted\` tinyint NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`animal\` CHANGE \`behaviorParticularity\` \`behaviorParticularity\` varchar(255) NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`animal\` CHANGE \`kidsOk\` \`kidsOk\` tinyint NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`animal\` CHANGE \`dogsOk\` \`dogsOk\` tinyint NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`animal\` CHANGE \`catsOk\` \`catsOk\` tinyint NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`animal\` CHANGE \`posture\` \`posture\` varchar(255) NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`animal\` CHANGE \`needFriends\` \`needFriends\` tinyint NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`animal\` CHANGE \`behaviour\` \`behaviour\` varchar(255) NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`animal\` CHANGE \`healthIssues\` \`healthIssues\` varchar(255) NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`animal\` CHANGE \`felvNegative\` \`felvNegative\` tinyint NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`animal\` CHANGE \`fivNegative\` \`fivNegative\` tinyint NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`animal\` CHANGE \`secondVaccinationDate\` \`secondVaccinationDate\` datetime NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`animal\` CHANGE \`firstVaccinationDate\` \`firstVaccinationDate\` datetime NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`animal\` CHANGE \`sterilised\` \`sterilised\` tinyint NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`animal\` CHANGE \`deathReason\` \`deathReason\` varchar(255) NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`animal\` CHANGE \`deathDate\` \`deathDate\` datetime NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`animal\` CHANGE \`exitInfos\` \`exitInfos\` varchar(255) NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`animal\` CHANGE \`exitReason\` \`exitReason\` varchar(255) NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`animal\` CHANGE \`exitDate\` \`exitDate\` datetime NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`animal\` CHANGE \`careInfos\` \`careInfos\` varchar(255) NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`animal\` CHANGE \`placeOfCare\` \`placeOfCare\` varchar(255) NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`animal\` CHANGE \`reasonForCare\` \`reasonForCare\` varchar(255) NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`animal\` CHANGE \`distinctiveSigns\` \`distinctiveSigns\` varchar(255) NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`animal\` CHANGE \`entryDate\` \`entryDate\` datetime NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`animal\` CHANGE \`birthdate\` \`birthdate\` datetime NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`animal\` CHANGE \`race\` \`race\` varchar(255) NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`animal\` CHANGE \`sexe\` \`sexe\` varchar(255) NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`host_family\` CHANGE \`situation\` \`situation\` varchar(255) NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`host_family\` CHANGE \`isTemporary\` \`isTemporary\` tinyint NULL DEFAULT '0'`
    );
    await queryRunner.query(
      `ALTER TABLE \`host_family\` CHANGE \`membershipUpToDate\` \`membershipUpToDate\` tinyint NULL DEFAULT '0'`
    );
    await queryRunner.query(
      `ALTER TABLE \`host_family\` CHANGE \`onBreak\` \`onBreak\` tinyint NULL DEFAULT '0'`
    );
    await queryRunner.query(
      `ALTER TABLE \`host_family\` CHANGE \`hostConditions\` \`hostConditions\` varchar(255) NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`host_family\` CHANGE \`canIsolate\` \`canIsolate\` tinyint NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`host_family\` CHANGE \`housingInformations\` \`housingInformations\` varchar(255) NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`host_family\` CHANGE \`observations\` \`observations\` varchar(255) NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`host_family\` CHANGE \`canProvideNightCare\` \`canProvideNightCare\` tinyint NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`host_family\` CHANGE \`canHostDisableAnimal\` \`canHostDisableAnimal\` tinyint NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`host_family\` CHANGE \`canProvideSociabilisation\` \`canProvideSociabilisation\` tinyint NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`host_family\` CHANGE \`canProvideVeterinaryCare\` \`canProvideVeterinaryCare\` tinyint NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`host_family\` CHANGE \`animalsInfos\` \`animalsInfos\` varchar(255) NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`host_family\` CHANGE \`childrenInfos\` \`childrenInfos\` varchar(255) NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`host_family\` CHANGE \`nbChildren\` \`nbChildren\` int NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`host_family\` CHANGE \`hasVehicule\` \`hasVehicule\` tinyint NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`host_family\` CHANGE \`driverLicense\` \`driverLicense\` tinyint NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`host_family\` CHANGE \`longitude\` \`longitude\` int NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`host_family\` CHANGE \`latitude\` \`latitude\` int NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`host_family\` CHANGE \`address\` \`address\` varchar(255) NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`host_family\` CHANGE \`socialNetworkAlias\` \`socialNetworkAlias\` varchar(255) NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`host_family\` CHANGE \`mail\` \`mail\` varchar(255) NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`host_family\` CHANGE \`phone\` \`phone\` varchar(255) NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` CHANGE \`isReferent\` \`isReferent\` tinyint NULL DEFAULT '0'`
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` CHANGE \`email\` \`email\` varchar(255) NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` CHANGE \`firstname\` \`firstname\` varchar(255) NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` CHANGE \`name\` \`name\` varchar(255) NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`animal_host_family\` CHANGE \`entryDate\` \`entryDate\` timestamp NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`veterinarian\` CHANGE \`priceLevel\` \`priceLevel\` int NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`veterinarian\` CHANGE \`longitude\` \`longitude\` int NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`veterinarian\` CHANGE \`latitude\` \`latitude\` int NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`veterinarian\` CHANGE \`address\` \`address\` varchar(255) NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`veterinarian\` CHANGE \`paymentMethod\` \`paymentMethod\` varchar(255) NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`veterinarian\` CHANGE \`invoicePaymentDate\` \`invoicePaymentDate\` varchar(255) NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`veterinarian\` CHANGE \`appointmentConfirmationProcedure\` \`appointmentConfirmationProcedure\` varchar(255) NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`veterinarian\` CHANGE \`emergencies\` \`emergencies\` varchar(255) NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`veterinarian\` CHANGE \`mail\` \`mail\` varchar(255) NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`veterinarian\` CHANGE \`phone\` \`phone\` varchar(255) NULL`
    );
  }
}
