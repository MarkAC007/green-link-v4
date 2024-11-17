import { initializeSkills } from './initializeSkills';
import { migrateSkillClaims } from './migrateSkillClaims';

export async function initializeDatabase() {
  try {
    // Initialize skills first
    await initializeSkills();
    
    // Then migrate skill claims
    await migrateSkillClaims();
    
    console.log('Database initialization completed successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}