import { initializeSkills } from './initializeSkills';

export async function initializeDatabase() {
  try {
    // Initialize skills collection
    await initializeSkills();
    
    console.log('Database initialization completed successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}