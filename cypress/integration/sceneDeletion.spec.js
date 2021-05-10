
/// <reference types="cypress" />

import { createDrawings } from "../../src/__testHelpers/creationForTests"


const SCENE_STORAGE_KEY = "claymate-scenes"

const NUMBER_OF_SCENES = 5;

const getSceneId = (drawing) => {
    return drawing.elements[0].id;
}

const DeleteButtonText = "\u2716";
const SelectedSceneBorder = "1px dotted rgb(128, 128, 128)"

context('Scene Deletion', () => {
    let scenes = []
    beforeEach(() => {
        scenes = createDrawings(NUMBER_OF_SCENES);
        window.localStorage.setItem(SCENE_STORAGE_KEY, JSON.stringify(scenes));
        cy.visit('/');
    });

    it('Shows Initial Scenes', () => {
        cy.contains("Add scene")
    })

    it('Delete First', () => {
        const firstSceneId = getSceneId(scenes[0]);
        cy.get(`[data-testid=${firstSceneId}]`).contains(`${DeleteButtonText}`).click({ force: true })
        cy.get(`[data-testid=${firstSceneId}]`).should("not.exist")
        const newCurrentSceneId = getSceneId(scenes[1]);
        cy.get(`[data-testid=${newCurrentSceneId}]`).should("have.css", "border", SelectedSceneBorder)
    })

    it('Delete Last', () => {
        const currentSceneId = getSceneId(scenes[0]);
        const sceneIdToDelete = getSceneId(scenes[scenes.length - 1]);
        cy.get(`[data-testid=${sceneIdToDelete}]`).contains(`${DeleteButtonText}`).click({ force: true })
        cy.get(`[data-testid=${sceneIdToDelete}]`).should("not.exist")
        cy.get(`[data-testid=${currentSceneId}]`).should("have.css", "border", SelectedSceneBorder)
    })

    it('Delete 2nd to Last', () => {
        const sceneIdToDelete = getSceneId(scenes[scenes.length - 2]);
        cy.get(`[data-testid=${sceneIdToDelete}]`).contains(`${DeleteButtonText}`).click({ force: true })
        cy.get(`[data-testid=${sceneIdToDelete}]`).should("not.exist")
    })

    it('Make last current and then delete it', () => {
        const sceneIdToDelete = getSceneId(scenes[scenes.length - 1]);
        cy.get(`[data-testid=${sceneIdToDelete}]`).click();
        cy.get(`[data-testid=${sceneIdToDelete}]`).contains(`${DeleteButtonText}`).click({ force: true })
        cy.get(`[data-testid=${sceneIdToDelete}]`).should("not.exist")
        const newCurrentSceneId = getSceneId(scenes[scenes.length - 2]);
        cy.get(`[data-testid=${newCurrentSceneId}]`).should("have.css", "border", SelectedSceneBorder)
    })

    it('Make last current and then delete first', () => {
        const currentSceneId = getSceneId(scenes[scenes.length - 1]);
        cy.get(`[data-testid=${currentSceneId}]`).click();
        const sceneIdToDelete = getSceneId(scenes[0]);
        cy.get(`[data-testid=${sceneIdToDelete}]`).contains(`${DeleteButtonText}`).click({ force: true })
        cy.get(`[data-testid=${sceneIdToDelete}]`).should("not.exist")
        cy.get(`[data-testid=${currentSceneId}]`).should("have.css", "border", SelectedSceneBorder)
    })

    it('Make 2nd to last current and then delete first', () => {
        const currentSceneId = getSceneId(scenes[scenes.length - 2]);
        cy.get(`[data-testid=${currentSceneId}]`).click();
        const sceneIdToDelete = getSceneId(scenes[0]);
        cy.get(`[data-testid=${sceneIdToDelete}]`).contains(`${DeleteButtonText}`).click({ force: true })
        cy.get(`[data-testid=${sceneIdToDelete}]`).should("not.exist")
        cy.get(`[data-testid=${currentSceneId}]`).should("have.css", "border", SelectedSceneBorder)
    })

    it('Make 2nd to last current and then delete second', () => {
        const currentSceneId = getSceneId(scenes[scenes.length - 2]);
        cy.get(`[data-testid=${currentSceneId}]`).click();
        const sceneIdToDelete = getSceneId(scenes[1]);
        cy.get(`[data-testid=${sceneIdToDelete}]`).contains(`${DeleteButtonText}`).click({ force: true })
        cy.get(`[data-testid=${sceneIdToDelete}]`).should("not.exist")
        cy.get(`[data-testid=${currentSceneId}]`).should("have.css", "border", SelectedSceneBorder)
    })

})