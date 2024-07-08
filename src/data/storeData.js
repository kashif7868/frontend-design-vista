// src/data/storeData.js

export const loadState = () => {
  try {
    const serializedState = localStorage.getItem('state');
    if (serializedState === null) {
      return undefined;
    }
    const state = JSON.parse(serializedState);

    // Convert base64 image data back to Blob URLs
    state.works.works = state.works.works.map(work => ({
      ...work,
      image: work.image ? `data:image/*;base64,${work.image}` : null,
    }));

    return state;
  } catch (err) {
    console.error("Could not load state", err);
    return undefined;
  }
};

export const saveState = (state) => {
  try {
    const serializedState = JSON.stringify({
      ...state,
      works: {
        ...state.works,
        works: state.works.works.map(work => ({
          ...work,
          image: work.image ? work.image.split(',')[1] : null,
        })),
      },
    });
    localStorage.setItem('state', serializedState);
  } catch (err) {
    console.error("Could not save state", err);
  }
};
