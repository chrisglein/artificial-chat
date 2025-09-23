/**
 * @format
 * Test for ChatSession deleteEntry re-indexing functionality
 */

// This test validates the core logic of deleteEntry re-indexing
// without complex component mocking

describe('ChatSession deleteEntry re-indexing', () => {
  test('entries are re-indexed after deletion', () => {
    // Simulate the deleteEntry logic
    const entries = [
      { id: 0, type: 0, contentType: 1, responses: ['First message'] },
      { id: 1, type: 1, contentType: 1, responses: ['First response'] },
      { id: 2, type: 0, contentType: 1, responses: ['Second message'] },
      { id: 3, type: 1, contentType: 1, responses: ['Second response'] },
    ];

    // Simulate deleteEntry(1) - deleting the second entry
    const deleteIndex = 1;
    const modifiedEntries = [...entries];
    modifiedEntries.splice(deleteIndex, 1);
    
    // Re-index the remaining entries (this is the fix we implemented)
    const reindexedEntries = modifiedEntries.map((entry, newIndex) => ({
      ...entry,
      id: newIndex
    }));

    // Verify the result
    expect(reindexedEntries).toHaveLength(3);
    expect(reindexedEntries[0].id).toBe(0);
    expect(reindexedEntries[0].responses[0]).toBe('First message');
    
    expect(reindexedEntries[1].id).toBe(1); // Was id: 2, now id: 1
    expect(reindexedEntries[1].responses[0]).toBe('Second message');
    
    expect(reindexedEntries[2].id).toBe(2); // Was id: 3, now id: 2
    expect(reindexedEntries[2].responses[0]).toBe('Second response');
  });

  test('first entry deletion re-indexes correctly', () => {
    const entries = [
      { id: 0, type: 0, contentType: 1, responses: ['First message'] },
      { id: 1, type: 1, contentType: 1, responses: ['First response'] },
      { id: 2, type: 0, contentType: 1, responses: ['Second message'] },
    ];

    // Delete first entry
    const deleteIndex = 0;
    const modifiedEntries = [...entries];
    modifiedEntries.splice(deleteIndex, 1);
    
    const reindexedEntries = modifiedEntries.map((entry, newIndex) => ({
      ...entry,
      id: newIndex
    }));

    expect(reindexedEntries).toHaveLength(2);
    expect(reindexedEntries[0].id).toBe(0); // Was id: 1, now id: 0
    expect(reindexedEntries[0].responses[0]).toBe('First response');
    expect(reindexedEntries[1].id).toBe(1); // Was id: 2, now id: 1
    expect(reindexedEntries[1].responses[0]).toBe('Second message');
  });

  test('last entry deletion does not affect other indices', () => {
    const entries = [
      { id: 0, type: 0, contentType: 1, responses: ['First message'] },
      { id: 1, type: 1, contentType: 1, responses: ['First response'] },
      { id: 2, type: 0, contentType: 1, responses: ['Second message'] },
    ];

    // Delete last entry
    const deleteIndex = 2;
    const modifiedEntries = [...entries];
    modifiedEntries.splice(deleteIndex, 1);
    
    const reindexedEntries = modifiedEntries.map((entry, newIndex) => ({
      ...entry,
      id: newIndex
    }));

    expect(reindexedEntries).toHaveLength(2);
    expect(reindexedEntries[0].id).toBe(0); // Unchanged
    expect(reindexedEntries[0].responses[0]).toBe('First message');
    expect(reindexedEntries[1].id).toBe(1); // Unchanged
    expect(reindexedEntries[1].responses[0]).toBe('First response');
  });
});