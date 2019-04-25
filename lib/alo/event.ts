let idx = 0;
let parentByTag = {};
let entityContainerByTag = {};
let childrenByTag = {};

const registerEntityContainer = function(containerTag, tag) {
  entityContainerByTag[tag] = containerTag;
  if (childrenByTag[tag]) {
    for (const child of childrenByTag[tag]) {
      registerEntityContainer(containerTag, child);
    }
  }
};

export const createTag = function({
  name = "",
  children,
  entityContainer = false
}: {
  name?: string;
  children?: string[];
  entityContainer?: boolean;
}) {
  const tag = `${idx++}-${name}`;

  if (children) {
    childrenByTag[tag] = children;

    for (const child of children) {
      parentByTag[child] = tag;
      if (entityContainer) {
        registerEntityContainer(tag, child);
      }
    }
  }

  return tag;
};

export const setWildCard = function(event, tag = "") {
  event.tags["*" + tag] = true;
  event.tagsSet = true;
};

export const setTag = function(
  event: EventInterface,
  tag: string,
  entityId?: number | string
) {
  event.tagsSet = true;

  event.tags[tag] = event.tags[tag] || true;

  const parentTag = parentByTag[tag];
  if (parentTag && !event.tags[parentTag]) {
    setTag(event, parentTag, entityId);
  }

  const containerTag = entityContainerByTag[tag];
  if (entityId && containerTag) {
    const containerEvent = (event.containers[containerTag] =
      event.containers[containerTag] || {});
    const containerEntityEvent = (containerEvent[entityId] =
      containerEvent[entityId] || {});
    containerEntityEvent[tag] = true;
  }
};

export const parentWildCardIsSet = function(event: EventInterface, childTag) {
  let origTag = childTag;

  while (true) {
    childTag = parentByTag[childTag];
    if (!childTag) {
      return false;
    }

    if (event.tags["*" + childTag]) {
      event.tags[origTag] = true;
      return true;
    }
  }
};

export const tagIsSet = function(
  event: EventInterface,
  tag,
  entityId?: number | string,
  checkWildCard = true
) {
  if (checkWildCard && event.tags["*"]) {
    return true;
  }

  let tagIsSet = event.tags[tag];
  if (entityId != null) {
    const containerTag = entityContainerByTag[tag];
    if (containerTag) {
      const containerEvent = event.containers[containerTag];
      const containerEntityEvent = containerEvent && containerEvent[entityId];
      tagIsSet = containerEntityEvent && containerEntityEvent[tag];
    }
  }

  const wildCardIsSet =
    !tagIsSet && (checkWildCard && parentWildCardIsSet(event, tag));

  return !!(tagIsSet || wildCardIsSet);
};

export interface EventInterface {
  // Tag key
  tagsSet: boolean;
  tags: {
    [key: string]: boolean;
  };
  containers: {
    [key: string]: {
      [key: string]: {
        [key: string]: boolean;
      };
      [key: number]: {
        [key: string]: boolean;
      };
    };
  };
}

export const createEvent = function(): EventInterface {
  return {
    tagsSet: false,
    tags: {},
    containers: {}
  };
};
