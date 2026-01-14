#include <SFML/Graphics.hpp>
#include <iostream>

int main() {
    // Create a window with neon-style settings
    sf::RenderWindow window(sf::VideoMode(800, 600), "Neon Game Spirit");
    window.setFramerateLimit(60);

    // Create a circle shape for a neon effect
    sf::CircleShape shape(100.f);
    shape.setFillColor(sf::Color::Cyan);
    shape.setOutlineThickness(5);
    shape.setOutlineColor(sf::Color::Magenta);
    shape.setPosition(350, 250);

    // Main game loop
    while (window.isOpen()) {
        sf::Event event;
        while (window.pollEvent(event)) {
            if (event.type == sf::Event::Closed) {
                window.close();
            }
        }

        // Clear the window with a dark background
        window.clear(sf::Color(10, 10, 30));

        // Draw the shape
        window.draw(shape);

        // Display everything
        window.display();
    }

    return 0;
}