import { In } from "typeorm";
import { AppDataSource } from "../config/database";
import { HostFamily } from "../models/HostFamily";

type GetAllParams = {
  kinds: string[];
  isAvailable?: boolean;
};

export class HostFamilyController {
  private hostFamilyRepository = AppDataSource.getRepository(HostFamily);

  async getAllHostFamilies(
    { kinds, isAvailable }: GetAllParams = { kinds: [] }
  ) {
    return await this.hostFamilyRepository.find({
      relations: {
        hostFamilyKinds: true,
        animalRelations: false,
        referent: true,
      },
      where: {
        isAvailable: isAvailable,
        hostFamilyKinds: kinds.length > 0 ? { id: In(kinds) } : {},
      },
    });
  }

  async getHostFamilyById(id: number) {
    return await this.hostFamilyRepository.findOne({
      where: { id },
      relations: {
        hostFamilyKinds: true,
        animalRelations: {
          animal: {
            species: true,
          },
        },
        referent: true,
      },
    });
  }

  async getCountHostFamilyAvailable() {
    const results = await this.hostFamilyRepository
      .createQueryBuilder("hf")
      .innerJoin("hf.hostFamilyKinds", "hfk")
      .innerJoin("hfk.species", "s") // Join avec Species pour récupérer le nom
      .select("COUNT(DISTINCT hf.id)", "count")
      .addSelect("s.id", "id")
      .where("hf.isAvailable = :isAvailable", { isAvailable: true })
      .andWhere("hf.onBreak = :onBreak", { onBreak: false })
      .groupBy("s.id")
      .getRawMany();

    const species = results.map((result) => ({
      id: result.id,
      name: result.name,
      count: parseInt(result.count) || 0,
    }));

    const total = species.reduce((acc, s) => acc + s.count, 0);

    return {
      total,
      species,
    };
  }

  async createHostFamily(hostFamilyData: Partial<HostFamily>) {
    const hostFamily = this.hostFamilyRepository.create(hostFamilyData);
    return await this.hostFamilyRepository.save(hostFamily);
  }

  async updateHostFamily(id: number, hostFamilyData: Partial<HostFamily>) {
    await this.hostFamilyRepository.update(id, hostFamilyData);
    return await this.getHostFamilyById(id);
  }

  async deleteHostFamily(id: number) {
    return await this.hostFamilyRepository.delete(id);
  }
}
