document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle mobile menu
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });

    // Weapon counters for each player
    let weaponCounters = { 1: 1, 2: 1 };

    // Add weapon button handlers
    document.querySelectorAll('.add-weapon-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const player = this.dataset.player;
            addWeapon(player);
        });
    });

    // Calculate button
    document.getElementById('calculate-btn').addEventListener('click', calculateDamage);

    // Reset button
    document.getElementById('reset-btn').addEventListener('click', resetCalculator);

    function addWeapon(player) {
        weaponCounters[player]++;
        const weaponsList = document.getElementById(`p${player}-weapons`);
        
        const weaponCard = document.createElement('div');
        weaponCard.className = 'weapon-card';
        weaponCard.innerHTML = `
            <div class="weapon-header">
                <span>Weapon ${weaponCounters[player]}</span>
                <button type="button" class="remove-weapon-btn" onclick="removeWeapon(this)">✕</button>
            </div>
            <div class="weapon-inputs">
                <div class="weapon-input-group">
                    <label>Max Damage</label>
                    <input type="number" class="weapon-max-damage" placeholder="5" value="5">
                </div>
                <div class="weapon-input-group">
                    <label>Falloff</label>
                    <input type="number" class="weapon-falloff" placeholder="1" value="1" step="0.5">
                </div>
                <div class="weapon-input-group">
                    <label>Dice Roll</label>
                    <input type="number" class="weapon-dice" placeholder="6" value="6" min="1" max="6">
                </div>
            </div>
        `;
        
        weaponsList.appendChild(weaponCard);
        updateRemoveButtons(player);
    }

    window.removeWeapon = function(btn) {
        const weaponCard = btn.closest('.weapon-card');
        const weaponsList = weaponCard.parentElement;
        const player = weaponsList.id.includes('p1') ? '1' : '2';
        
        weaponCard.remove();
        updateRemoveButtons(player);
        renumberWeapons(player);
    };

    function updateRemoveButtons(player) {
        const weaponsList = document.getElementById(`p${player}-weapons`);
        const weapons = weaponsList.querySelectorAll('.weapon-card');
        
        weapons.forEach((weapon, index) => {
            const removeBtn = weapon.querySelector('.remove-weapon-btn');
            if (weapons.length > 1) {
                removeBtn.style.display = 'block';
            } else {
                removeBtn.style.display = 'none';
            }
        });
    }

    function renumberWeapons(player) {
        const weaponsList = document.getElementById(`p${player}-weapons`);
        const weapons = weaponsList.querySelectorAll('.weapon-card');
        
        weapons.forEach((weapon, index) => {
            const header = weapon.querySelector('.weapon-header span');
            header.textContent = `Weapon ${index + 1}`;
        });
        
        weaponCounters[player] = weapons.length;
    }

    function parsePosition(position) {
        // Parse position like "B12" or "G4" into column and row
        const match = position.trim().toUpperCase().match(/^([A-Z]+)(\d+)$/);
        if (!match) return null;
        
        const col = match[1];
        const row = parseInt(match[2]);
        
        // Convert column letter to number (A=1, B=2, etc.)
        let colNum = 0;
        for (let i = 0; i < col.length; i++) {
            colNum = colNum * 26 + (col.charCodeAt(i) - 64);
        }
        
        return { col: colNum, row: row };
    }

    function calculateDistance(pos1, pos2) {
        // Calculate the distance between two positions using diagonal movement
        // Distance is the number of squares BETWEEN players (Chebyshev distance - 1)
        const colDiff = Math.abs(pos1.col - pos2.col);
        const rowDiff = Math.abs(pos1.row - pos2.row);
        const movementSquares = Math.max(colDiff, rowDiff);
        // Subtract 1 to get squares between (not including occupied squares)
        return Math.max(0, movementSquares - 1);
    }

    function calculateDamage() {
        const p1Position = document.getElementById('p1-position').value;
        const p2Position = document.getElementById('p2-position').value;

        // Parse positions
        const pos1 = parsePosition(p1Position);
        const pos2 = parsePosition(p2Position);

        if (!pos1 || !pos2) {
            alert('Please enter valid positions (e.g., B12, G4)');
            return;
        }

        // Calculate distance
        const distance = calculateDistance(pos1, pos2);
        document.getElementById('distance-value').textContent = distance;

        // Get modifiers
        const p1DamageMod = parseInt(document.getElementById('p1-damage-mod').value) || 0;
        const p1AttackMod = parseInt(document.getElementById('p1-attack-mod').value) || 0;
        const p2DamageMod = parseInt(document.getElementById('p2-damage-mod').value) || 0;
        const p2AttackMod = parseInt(document.getElementById('p2-attack-mod').value) || 0;

        // Calculate damage for each player
        const p1Data = calculatePlayerDamage(1, distance, p1DamageMod, p1AttackMod);
        const p2Data = calculatePlayerDamage(2, distance, p2DamageMod, p2AttackMod);

        // Display results
        document.getElementById('p1-result').textContent = p1Data.totalDamage;
        document.getElementById('p2-result').textContent = p2Data.totalDamage;

        // Show breakdown
        displayBreakdown(p1Data, p2Data);
    }

    function calculatePlayerDamage(player, distance, damageMod, attackMod) {
        const weaponsList = document.getElementById(`p${player}-weapons`);
        const weapons = weaponsList.querySelectorAll('.weapon-card');
        
        let totalDamage = 0;
        const breakdowns = [];

        weapons.forEach((weapon, index) => {
            const maxDamage = parseInt(weapon.querySelector('.weapon-max-damage').value) || 0;
            const falloff = parseFloat(weapon.querySelector('.weapon-falloff').value) || 0;
            const diceRoll = parseInt(weapon.querySelector('.weapon-dice').value) || 0;

            // Calculate: (Max Damage + Damage Modifier - (Distance × Falloff)) × (Dice Roll + Attack Roll Modifier)
            const falloffReduction = distance * falloff;
            const damagePerShot = maxDamage + damageMod - falloffReduction;
            // Round up the damage per shot before multiplying by dice roll
            const adjustedDamage = Math.ceil(Math.max(0, damagePerShot));
            const adjustedRoll = diceRoll + attackMod;
            const finalDamage = adjustedDamage * adjustedRoll;

            totalDamage += finalDamage;

            breakdowns.push({
                weaponNum: index + 1,
                maxDamage: maxDamage,
                damageMod: damageMod,
                falloff: falloff,
                falloffReduction: falloffReduction,
                adjustedDamage: adjustedDamage,
                diceRoll: diceRoll,
                attackMod: attackMod,
                adjustedRoll: adjustedRoll,
                finalDamage: finalDamage
            });
        });

        return {
            totalDamage: totalDamage,
            breakdowns: breakdowns
        };
    }

    function displayBreakdown(p1Data, p2Data) {
        const breakdownSection = document.getElementById('breakdown-section');
        breakdownSection.style.display = 'block';

        // Player 1 breakdown
        const p1Breakdown = document.getElementById('p1-breakdown');
        p1Breakdown.innerHTML = '';
        p1Data.breakdowns.forEach(bd => {
            const item = document.createElement('div');
            item.className = 'breakdown-item';
            const damageBeforeRound = bd.maxDamage + bd.damageMod - bd.falloffReduction;
            item.innerHTML = `
                <h4>Weapon ${bd.weaponNum}</h4>
                <p>Max Damage: ${bd.maxDamage} ${bd.damageMod >= 0 ? '+' : ''}${bd.damageMod} (modifier) = ${bd.maxDamage + bd.damageMod}</p>
                <p>Falloff Reduction: ${bd.falloff} × ${(bd.falloffReduction / bd.falloff).toFixed(1)} squares = -${bd.falloffReduction.toFixed(1)}</p>
                <p>Damage per Shot: ${damageBeforeRound.toFixed(1)} → ${bd.adjustedDamage} (rounded up)</p>
                <p>Dice Roll: ${bd.diceRoll} ${bd.attackMod >= 0 ? '+' : ''}${bd.attackMod} (modifier) = ${bd.adjustedRoll}</p>
                <p class="final-damage">Damage: ${bd.adjustedDamage} × ${bd.adjustedRoll} = ${bd.finalDamage}</p>
            `;
            p1Breakdown.appendChild(item);
        });

        // Player 2 breakdown
        const p2Breakdown = document.getElementById('p2-breakdown');
        p2Breakdown.innerHTML = '';
        p2Data.breakdowns.forEach(bd => {
            const item = document.createElement('div');
            item.className = 'breakdown-item';
            const damageBeforeRound = bd.maxDamage + bd.damageMod - bd.falloffReduction;
            item.innerHTML = `
                <h4>Weapon ${bd.weaponNum}</h4>
                <p>Max Damage: ${bd.maxDamage} ${bd.damageMod >= 0 ? '+' : ''}${bd.damageMod} (modifier) = ${bd.maxDamage + bd.damageMod}</p>
                <p>Falloff Reduction: ${bd.falloff} × ${(bd.falloffReduction / bd.falloff).toFixed(1)} squares = -${bd.falloffReduction.toFixed(1)}</p>
                <p>Damage per Shot: ${damageBeforeRound.toFixed(1)} → ${bd.adjustedDamage} (rounded up)</p>
                <p>Dice Roll: ${bd.diceRoll} ${bd.attackMod >= 0 ? '+' : ''}${bd.attackMod} (modifier) = ${bd.adjustedRoll}</p>
                <p class="final-damage">Damage: ${bd.adjustedDamage} × ${bd.adjustedRoll} = ${bd.finalDamage}</p>
            `;
            p2Breakdown.appendChild(item);
        });

        // Scroll to breakdown
        breakdownSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function resetCalculator() {
        // Reset positions
        document.getElementById('p1-position').value = '';
        document.getElementById('p2-position').value = '';

        // Reset modifiers
        document.getElementById('p1-damage-mod').value = 0;
        document.getElementById('p1-attack-mod').value = 0;
        document.getElementById('p2-damage-mod').value = 0;
        document.getElementById('p2-attack-mod').value = 0;

        // Reset weapons to default
        document.getElementById('p1-weapons').innerHTML = `
            <div class="weapon-card">
                <div class="weapon-header">
                    <span>Weapon 1</span>
                    <button type="button" class="remove-weapon-btn" style="display: none;">✕</button>
                </div>
                <div class="weapon-inputs">
                    <div class="weapon-input-group">
                        <label>Max Damage</label>
                        <input type="number" class="weapon-max-damage" placeholder="5" value="5">
                    </div>
                    <div class="weapon-input-group">
                        <label>Falloff</label>
                        <input type="number" class="weapon-falloff" placeholder="1" value="1" step="0.5">
                    </div>
                    <div class="weapon-input-group">
                        <label>Dice Roll</label>
                        <input type="number" class="weapon-dice" placeholder="6" value="6" min="1" max="6">
                    </div>
                </div>
            </div>
        `;

        document.getElementById('p2-weapons').innerHTML = `
            <div class="weapon-card">
                <div class="weapon-header">
                    <span>Weapon 1</span>
                    <button type="button" class="remove-weapon-btn" style="display: none;">✕</button>
                </div>
                <div class="weapon-inputs">
                    <div class="weapon-input-group">
                        <label>Max Damage</label>
                        <input type="number" class="weapon-max-damage" placeholder="5" value="5">
                    </div>
                    <div class="weapon-input-group">
                        <label>Falloff</label>
                        <input type="number" class="weapon-falloff" placeholder="1" value="1" step="0.5">
                    </div>
                    <div class="weapon-input-group">
                        <label>Dice Roll</label>
                        <input type="number" class="weapon-dice" placeholder="4" value="4" min="1" max="6">
                    </div>
                </div>
            </div>
        `;

        weaponCounters = { 1: 1, 2: 1 };

        // Reset results
        document.getElementById('p1-result').textContent = '0';
        document.getElementById('p2-result').textContent = '0';
        document.getElementById('distance-value').textContent = '-';

        // Hide breakdown
        document.getElementById('breakdown-section').style.display = 'none';
    }
});
