export const getAllItems = (dynasties: any[]) => {
  if (!Array.isArray(dynasties)) return [];

  const allItems: any[] = [];
  dynasties.forEach((dynasty) => {
    const dynastyYear = dynasty.start_year || 0;
    allItems.push({ ...dynasty, year: dynastyYear });

    if (dynasty.subEvents && Array.isArray(dynasty.subEvents)) {
      dynasty.subEvents.forEach((subEvent: any) => {
        allItems.push({ 
          ...subEvent, 
          parentId: dynasty.id, 
          isSubEvent: true, 
          year: subEvent.start_year || dynastyYear 
        });
      });
    }

    if (dynasty.characters && Array.isArray(dynasty.characters)) {
      dynasty.characters.forEach((char: any) => {
        allItems.push({ 
          ...char, 
          parentId: dynasty.id, 
          isCharacter: true, 
          year: char.birth_year 
        });
      });
    }
  });

  allItems.sort((a, b) => (a.year || 0) - (b.year || 0));
  return allItems;
};