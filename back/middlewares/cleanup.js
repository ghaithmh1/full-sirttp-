const User = require("../models/userModel");
const Entreprise = require("../models/entrepriseModel");

const cleanupOrphanUsers = async () => {
  try {
    const threeDaysAgo = new Date(Date.now() - 1000 * 60 * 60 * 24 * 3);

    // 1️⃣ Supprimer les utilisateurs non complétés depuis > 3 jours
    const userResult = await User.deleteMany({
      completed: false,
      createdAt: { $lt: threeDaysAgo }
    });
    console.log(`Utilisateurs orphelins supprimés: ${userResult.deletedCount}`);

    // 2️⃣ Supprimer les pendingUsers vieux de > 3 jours dans chaque entreprise
    const entreprises = await Entreprise.find({ "pendingUsers.0": { $exists: true } });

    for (const entreprise of entreprises) {
      const originalCount = entreprise.pendingUsers.length;

      entreprise.pendingUsers = entreprise.pendingUsers.filter(pu => pu.date > threeDaysAgo);

      if (entreprise.pendingUsers.length !== originalCount) {
        await entreprise.save();
        console.log(`Pending users supprimés pour entreprise ${entreprise.nom}: ${originalCount - entreprise.pendingUsers.length}`);
      }
    }

  } catch (err) {
    console.error("Erreur cleanup:", err);
  }
};

module.exports = { cleanupOrphanUsers };
